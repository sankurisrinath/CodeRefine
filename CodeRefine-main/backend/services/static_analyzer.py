import json
import subprocess
import tempfile
import os
import warnings


def run_static_analysis(language: str, code: str) -> list:
    """Run static analysis on the given code using the appropriate tool."""
    language = language.lower()

    if language == "python":
        return _run_bandit(code)
    elif language == "javascript":
        return _run_eslint(code)
    elif language in ("c", "cpp"):
        return _run_cppcheck(code, language)
    else:
        return []


def _run_bandit(code: str) -> list:
    """Run Bandit static analysis on Python code."""
    suffix = ".py"
    with tempfile.NamedTemporaryFile(mode="w", suffix=suffix, delete=False) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["bandit", "-f", "json", "-q", tmp_path],
            capture_output=True,
            text=True,
            timeout=30,
        )
        output = result.stdout or result.stderr
        try:
            data = json.loads(output)
        except json.JSONDecodeError:
            return []

        issues = []
        for item in data.get("results", []):
            issues.append({
                "type": "security",
                "line": item.get("line_number", 0),
                "severity": item.get("issue_severity", "MEDIUM").upper(),
                "message": item.get("issue_text", ""),
                "source": "static",
            })
        return issues
    except FileNotFoundError:
        warnings.warn("bandit is not installed; skipping Python static analysis.")
        return []
    except subprocess.TimeoutExpired:
        warnings.warn("bandit timed out; skipping Python static analysis.")
        return []
    finally:
        os.unlink(tmp_path)


def _run_eslint(code: str) -> list:
    """Run ESLint static analysis on JavaScript code."""
    suffix = ".js"
    with tempfile.NamedTemporaryFile(mode="w", suffix=suffix, delete=False) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["eslint", "--format", "json", tmp_path],
            capture_output=True,
            text=True,
            timeout=30,
        )
        output = result.stdout or ""
        try:
            data = json.loads(output)
        except json.JSONDecodeError:
            return []

        issues = []
        for file_result in data:
            for msg in file_result.get("messages", []):
                severity_map = {1: "LOW", 2: "HIGH"}
                issues.append({
                    "type": "lint",
                    "line": msg.get("line", 0),
                    "severity": severity_map.get(msg.get("severity", 1), "MEDIUM"),
                    "message": msg.get("message", ""),
                    "source": "static",
                })
        return issues
    except FileNotFoundError:
        warnings.warn("eslint is not installed; skipping JavaScript static analysis.")
        return []
    except subprocess.TimeoutExpired:
        warnings.warn("eslint timed out; skipping JavaScript static analysis.")
        return []
    finally:
        os.unlink(tmp_path)


def _run_cppcheck(code: str, language: str) -> list:
    """Run cppcheck static analysis on C/C++ code."""
    suffix = ".cpp" if language == "cpp" else ".c"
    with tempfile.NamedTemporaryFile(mode="w", suffix=suffix, delete=False) as tmp:
        tmp.write(code)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            [
                "cppcheck",
                "--enable=all",
                "--output-format=xml",
                "--xml-version=2",
                tmp_path,
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        # cppcheck writes XML to stderr
        xml_output = result.stderr or ""
        issues = _parse_cppcheck_xml(xml_output)
        return issues
    except FileNotFoundError:
        warnings.warn("cppcheck is not installed; skipping C/C++ static analysis.")
        return []
    except subprocess.TimeoutExpired:
        warnings.warn("cppcheck timed out; skipping C/C++ static analysis.")
        return []
    finally:
        os.unlink(tmp_path)


def _parse_cppcheck_xml(xml_output: str) -> list:
    """Parse cppcheck XML output into structured issues."""
    import xml.etree.ElementTree as ET

    issues = []
    try:
        root = ET.fromstring(xml_output)
        for errors in root.iter("errors"):
            for error in errors.iter("error"):
                severity_raw = error.get("severity", "style")
                severity_map = {
                    "error": "HIGH",
                    "warning": "MEDIUM",
                    "style": "LOW",
                    "performance": "MEDIUM",
                    "portability": "LOW",
                    "information": "LOW",
                }
                severity = severity_map.get(severity_raw, "LOW")
                line = 0
                for location in error.iter("location"):
                    line = int(location.get("line", 0))
                    break
                issues.append({
                    "type": error.get("id", "general"),
                    "line": line,
                    "severity": severity,
                    "message": error.get("msg", ""),
                    "source": "static",
                })
    except ET.ParseError:
        pass
    return issues
