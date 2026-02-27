export const mockData = {
  python: {
    sampleCode: `import os
import json

# Password hardcoded - security issue
password = "admin123"
api_key = "sk-1234567890abcdef"

def process_user_data(user_input):
    # No input validation
    query = "SELECT * FROM users WHERE name = " + user_input
    
    data = fetch_data(query)
    results = []
    
    # O(n^2) nested loop
    for i in range(len(data)):
        for j in range(len(data)):
            if data[i]['id'] == data[j]['parent_id']:
                results.append(data[i])
    
    temp = calculate_something()
    
    # Magic number
    if len(results) > 42:
        return results[:42]
    
    return results

def calculate_something():
    total = 0
    base = compute_base()
    for i in range(100):
        # Invariant computation inside loop
        multiplier = get_multiplier()
        total += base * multiplier * i
    return total

def fetch_data(query):
    pass

def compute_base():
    return 1.5

def get_multiplier():
    return 2`,
    results: {
      bugs: [
        { severity: "High", line: 12, message: "Possible SQL injection vulnerability", suggestion: "Use parameterized queries instead of string concatenation" },
        { severity: "Medium", line: 25, message: "Unused variable 'temp' detected", suggestion: "Remove unused variable or use it in logic" },
        { severity: "Low", line: 28, message: "Magic number 42 used directly", suggestion: "Extract magic number into a named constant like MAX_RESULTS = 42" }
      ],
      performance: [
        { severity: "High", line: 18, message: "Nested loop with O(n²) complexity", suggestion: "Consider using a hash map for O(n) lookup" },
        { severity: "Medium", line: 38, message: "Redundant computation inside loop", suggestion: "Move get_multiplier() call outside the loop as it returns a constant" }
      ],
      security: [
        { severity: "High", line: 4, message: "Hardcoded password detected", suggestion: "Use environment variables or a secrets manager like AWS Secrets Manager" },
        { severity: "High", line: 5, message: "Hardcoded API key detected", suggestion: "Use os.environ.get('API_KEY') to retrieve secrets from environment" },
        { severity: "Medium", line: 9, message: "Input not sanitized before SQL query", suggestion: "Validate and sanitize all user inputs, use ORM or parameterized queries" }
      ],
      bestPractices: [
        { severity: "Medium", line: 8, message: "Function process_user_data exceeds 20 lines", suggestion: "Break down into smaller, single-responsibility functions" },
        { severity: "Low", line: 8, message: "Missing docstring for public function", suggestion: "Add a descriptive docstring explaining parameters and return value" },
        { severity: "Low", line: 33, message: "Missing docstring for calculate_something", suggestion: "Add docstring to describe what this function calculates" }
      ],
      optimizedCode: `import os
from typing import Optional

MAX_RESULTS = 42

def process_user_data(user_input: str) -> list:
    """Process user data safely with optimized lookup.
    
    Args:
        user_input: The user-provided search term
    Returns:
        List of matching data items
    """
    if not user_input or not isinstance(user_input, str):
        return []
    
    # Use parameterized query to prevent SQL injection
    data = fetch_data_safe(user_input)
    
    # Use hash map for O(n) lookup instead of O(n^2)
    parent_map = {item['id']: item for item in data}
    results = [
        item for item in data 
        if item.get('parent_id') in parent_map
    ]
    
    return results[:MAX_RESULTS]


def calculate_something() -> float:
    """Calculate weighted sum with base multiplier."""
    total = 0
    base = compute_base()
    # Move invariant computation outside loop
    multiplier = get_multiplier()
    for i in range(100):
        total += base * multiplier * i
    return total


def fetch_data_safe(search_term: str) -> list:
    """Fetch data using parameterized query."""
    # Use parameterized query: SELECT * FROM users WHERE name = ?
    pass


def compute_base() -> float:
    return 1.5


def get_multiplier() -> float:
    return 2.0
`,
      confidence: 87
    }
  },
  java: {
    sampleCode: `import java.sql.*;
import java.util.*;

public class UserService {
    // Hardcoded credentials
    private static final String DB_PASSWORD = "secret123";
    private static final String DB_URL = "jdbc:mysql://localhost/mydb";
    
    public List<User> getUsers(String username) throws SQLException {
        Connection conn = DriverManager.getConnection(DB_URL, "admin", DB_PASSWORD);
        
        // SQL injection vulnerability
        String query = "SELECT * FROM users WHERE username = '" + username + "'";
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        
        List<User> users = new ArrayList<>();
        List<User> allUsers = fetchAllUsers(conn);
        
        // O(n^2) nested loop
        for (int i = 0; i < users.size(); i++) {
            for (int j = 0; j < allUsers.size(); j++) {
                if (users.get(i).getId() == allUsers.get(j).getParentId()) {
                    users.add(allUsers.get(j));
                }
            }
        }
        
        String temp = "unused";
        
        // Magic number
        if (users.size() > 100) {
            return users.subList(0, 100);
        }
        
        return users;
    }
    
    private List<User> fetchAllUsers(Connection conn) {
        return new ArrayList<>();
    }
    
    public void processData(List<Integer> data) {
        // Redundant computation in loop
        for (int i = 0; i < data.size(); i++) {
            int baseValue = computeBaseValue();
            System.out.println(data.get(i) * baseValue);
        }
    }
    
    private int computeBaseValue() {
        return 42;
    }
}`,
    results: {
      bugs: [
        { severity: "High", line: 12, message: "SQL injection vulnerability via string concatenation", suggestion: "Use PreparedStatement with parameterized queries" },
        { severity: "High", line: 21, message: "ConcurrentModificationException risk: modifying list while iterating", suggestion: "Use a separate result list instead of adding to the iterated collection" },
        { severity: "Medium", line: 28, message: "Unused variable 'temp' declared", suggestion: "Remove unused variable declaration" },
        { severity: "Low", line: 31, message: "Magic number 100 used directly", suggestion: "Define MAX_USERS = 100 as a named constant" }
      ],
      performance: [
        { severity: "High", line: 20, message: "Nested loop with O(n²) complexity", suggestion: "Build a HashMap<Integer, User> from allUsers for O(1) lookup" },
        { severity: "Medium", line: 43, message: "computeBaseValue() called on every loop iteration", suggestion: "Move computeBaseValue() call outside the loop" },
        { severity: "Low", line: 10, message: "Database connection not closed after use", suggestion: "Use try-with-resources to ensure connection is always closed" }
      ],
      security: [
        { severity: "High", line: 5, message: "Hardcoded database password in source code", suggestion: "Use environment variables or a vault service for credentials" },
        { severity: "High", line: 12, message: "SQL injection via string concatenation", suggestion: "Use PreparedStatement: conn.prepareStatement(\"SELECT * FROM users WHERE username = ?\")" },
        { severity: "Medium", line: 10, message: "Database credentials passed in plaintext", suggestion: "Use connection pooling with encrypted credential storage" }
      ],
      bestPractices: [
        { severity: "Medium", line: 9, message: "Method getUsers() handles too many responsibilities", suggestion: "Separate database connection, query execution, and data transformation into different methods" },
        { severity: "Low", line: 9, message: "Missing Javadoc for public method", suggestion: "Add Javadoc with @param, @return, and @throws documentation" },
        { severity: "Low", line: 4, message: "Class missing Javadoc comment", suggestion: "Add class-level Javadoc describing the purpose of UserService" }
      ],
      optimizedCode: `import java.sql.*;
import java.util.*;

/**
 * Service for managing user data operations.
 * Uses secure parameterized queries and efficient data structures.
 */
public class UserService {
    private static final int MAX_USERS = 100;
    private static final String DB_URL = System.getenv("DB_URL");
    
    /**
     * Retrieves users matching the given username.
     * @param username the username to search for
     * @return list of matching users
     * @throws SQLException if a database error occurs
     */
    public List<User> getUsers(String username) throws SQLException {
        String query = "SELECT * FROM users WHERE username = ?";
        
        try (Connection conn = DriverManager.getConnection(
                DB_URL,
                System.getenv("DB_USER"),
                System.getenv("DB_PASSWORD"));
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            
            List<User> users = new ArrayList<>();
            List<User> allUsers = fetchAllUsers(conn);
            
            // Build HashMap for O(n) lookup
            Map<Integer, User> userMap = new HashMap<>();
            for (User user : allUsers) {
                userMap.put(user.getId(), user);
            }
            
            List<User> results = new ArrayList<>();
            for (User user : users) {
                if (userMap.containsKey(user.getParentId())) {
                    results.add(userMap.get(user.getParentId()));
                }
            }
            
            return results.size() > MAX_USERS 
                ? results.subList(0, MAX_USERS) 
                : results;
        }
    }
    
    public void processData(List<Integer> data) {
        // Move invariant computation outside loop
        int baseValue = computeBaseValue();
        for (int value : data) {
            System.out.println(value * baseValue);
        }
    }
    
    private int computeBaseValue() {
        return 42;
    }
    
    private List<User> fetchAllUsers(Connection conn) {
        return new ArrayList<>();
    }
}`,
      confidence: 82
    }
  },
  cpp: {
    sampleCode: `#include <iostream>
#include <vector>
#include <string>
#include <cstring>

// Hardcoded credentials
const char* PASSWORD = "admin123";
const char* API_KEY = "secret_key_12345";

void processInput(char* userInput) {
    char buffer[64];
    // Buffer overflow vulnerability
    strcpy(buffer, userInput);
    
    std::cout << "Processing: " << buffer << std::endl;
}

int findMatches(std::vector<int>& data) {
    int count = 0;
    // O(n^2) complexity
    for (int i = 0; i < data.size(); i++) {
        for (int j = 0; j < data.size(); j++) {
            if (data[i] == data[j] && i != j) {
                count++;
            }
        }
    }
    // Magic number
    return count / 2;
}

void printData(std::vector<int>& data) {
    for (int i = 0; i < data.size(); i++) {
        // Redundant computation
        int base = computeBase();
        std::cout << data[i] * base << std::endl;
    }
}

int computeBase() {
    return 10;
}

int main() {
    char input[256];
    std::cin >> input;
    processInput(input);
    
    std::vector<int> data = {1, 2, 3, 2, 1};
    std::cout << "Matches: " << findMatches(data) << std::endl;
    
    int* ptr = new int(42);
    // Memory leak - ptr never deleted
    
    std::string unused_var = "never used";
    
    return 0;
}`,
    results: {
      bugs: [
        { severity: "High", line: 12, message: "Buffer overflow: strcpy() with unbounded input", suggestion: "Use strncpy(buffer, userInput, sizeof(buffer)-1) or std::string" },
        { severity: "High", line: 50, message: "Memory leak: 'new int(42)' never deleted", suggestion: "Use delete ptr; or prefer smart pointers (std::unique_ptr<int>)" },
        { severity: "Medium", line: 53, message: "Unused variable 'unused_var'", suggestion: "Remove unused variable declaration" },
        { severity: "Low", line: 27, message: "Magic number 2 used directly in division", suggestion: "Define a named constant: const int DUPLICATE_DIVISOR = 2;" }
      ],
      performance: [
        { severity: "High", line: 20, message: "O(n²) nested loop for duplicate detection", suggestion: "Use std::unordered_set or sort+scan for O(n log n) or O(n) complexity" },
        { severity: "Medium", line: 33, message: "computeBase() called on every loop iteration", suggestion: "Move computeBase() outside the loop: int base = computeBase();" },
        { severity: "Low", line: 20, message: "data.size() called multiple times in loop condition", suggestion: "Cache size: const size_t n = data.size(); and use n in condition" }
      ],
      security: [
        { severity: "High", line: 7, message: "Hardcoded password in global scope", suggestion: "Use environment variables or secure configuration management" },
        { severity: "High", line: 12, message: "Unsafe strcpy() causes buffer overflow", suggestion: "Use safe string functions: strncpy, strlcpy, or std::string" },
        { severity: "Medium", line: 8, message: "Hardcoded API key in source code", suggestion: "Load API key from environment: getenv(\"API_KEY\")" }
      ],
      bestPractices: [
        { severity: "Medium", line: 10, message: "Using raw char* instead of std::string", suggestion: "Prefer std::string for safer, more idiomatic C++ string handling" },
        { severity: "Medium", line: 50, message: "Using raw pointer instead of smart pointer", suggestion: "Use std::unique_ptr<int> ptr = std::make_unique<int>(42);" },
        { severity: "Low", line: 10, message: "Missing function documentation", suggestion: "Add Doxygen-style comments to document function parameters and behavior" }
      ],
      optimizedCode: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <memory>
#include <cstdlib>

void processInput(const std::string& userInput) {
    // Safe: use std::string instead of raw char buffer
    std::cout << "Processing: " << userInput << std::endl;
}

int findMatches(const std::vector<int>& data) {
    // O(n) using unordered_set for duplicate detection
    std::unordered_set<int> seen;
    std::unordered_set<int> duplicates;
    
    for (const int& val : data) {
        if (seen.count(val)) {
            duplicates.insert(val);
        }
        seen.insert(val);
    }
    
    return static_cast<int>(duplicates.size());
}

void printData(const std::vector<int>& data) {
    // Move invariant computation outside loop
    const int base = computeBase();
    const size_t n = data.size();
    
    for (size_t i = 0; i < n; ++i) {
        std::cout << data[i] * base << '\\n';
    }
}

int computeBase() {
    return 10;
}

int main() {
    std::string input;
    std::cin >> input;
    processInput(input);
    
    std::vector<int> data = {1, 2, 3, 2, 1};
    std::cout << "Matches: " << findMatches(data) << '\\n';
    
    // Use smart pointer to prevent memory leak
    auto ptr = std::make_unique<int>(42);
    
    return 0;
}`,
      confidence: 91
    }
  }
}

export const languages = ['python', 'java', 'cpp']

export const languageLabels = {
  python: 'Python',
  java: 'Java',
  cpp: 'C++'
}

export const monacoLanguageMap = {
  python: 'python',
  java: 'java',
  cpp: 'cpp'
}

export const dashboardMetrics = {
  totalAnalyses: 247,
  bugsDetected: 89,
  performanceGains: 34,
  avgConfidenceScore: 87,
  codeQualityIndex: 92
}

export const analysisHistory = [
  { id: 1, title: 'user_auth.py', language: 'Python', mode: 'Bug Detection', confidence: 91, date: '2026-02-25', snippet: 'def authenticate_user(username, password)' },
  { id: 2, title: 'UserService.java', language: 'Java', mode: 'Security Scan', confidence: 85, date: '2026-02-24', snippet: 'public List<User> getUsers(String username)' },
  { id: 3, title: 'main.cpp', language: 'C++', mode: 'Performance Optimization', confidence: 78, date: '2026-02-23', snippet: 'int findMatches(std::vector<int>& data)' },
  { id: 4, title: 'data_processor.py', language: 'Python', mode: 'Code Cleanup', confidence: 94, date: '2026-02-22', snippet: 'def process_data(df: pd.DataFrame)' },
  { id: 5, title: 'ApiController.java', language: 'Java', mode: 'Refactor Mode', confidence: 88, date: '2026-02-21', snippet: 'public ResponseEntity<ApiResponse> handleRequest' },
  { id: 6, title: 'utils.cpp', language: 'C++', mode: 'Complexity Analysis', confidence: 76, date: '2026-02-20', snippet: 'void processInput(char* userInput)' },
]

export const projectsData = [
  { id: 1, name: 'E-Commerce Backend', description: 'FastAPI backend for e-commerce platform with authentication and payment processing', fileCount: 24, lastUpdated: '2026-02-25', languages: ['Python', 'SQL'], status: 'Active' },
  { id: 2, name: 'Microservices Auth', description: 'JWT-based authentication microservice with Redis session management', fileCount: 12, lastUpdated: '2026-02-22', languages: ['Java', 'Docker'], status: 'Active' },
  { id: 3, name: 'Real-time Dashboard', description: 'WebSocket-powered analytics dashboard with live data visualization', fileCount: 31, lastUpdated: '2026-02-18', languages: ['C++', 'WebSockets'], status: 'In Progress' },
  { id: 4, name: 'ML Pipeline', description: 'Data ingestion and preprocessing pipeline for ML model training', fileCount: 18, lastUpdated: '2026-02-15', languages: ['Python', 'Pandas'], status: 'Active' },
  { id: 5, name: 'API Gateway', description: 'Kong-based API gateway configuration with rate limiting and logging', fileCount: 8, lastUpdated: '2026-02-10', languages: ['Java', 'YAML'], status: 'Archived' },
  { id: 6, name: 'Game Engine Core', description: 'High-performance 2D game engine with ECS architecture', fileCount: 47, lastUpdated: '2026-02-08', languages: ['C++'], status: 'In Progress' },
]

export const insightsData = {
  issuesByType: [
    { name: 'Bug', count: 89 },
    { name: 'Security', count: 42 },
    { name: 'Performance', count: 67 },
    { name: 'Style', count: 103 },
    { name: 'Complexity', count: 55 },
  ],
  languageUsage: [
    { name: 'Python', value: 45 },
    { name: 'Java', value: 30 },
    { name: 'C++', value: 25 },
  ],
  confidenceTrend: [
    { month: 'Sep', score: 72 },
    { month: 'Oct', score: 75 },
    { month: 'Nov', score: 78 },
    { month: 'Dec', score: 82 },
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 87 },
  ],
  performanceTrend: [
    { month: 'Sep', gain: 18 },
    { month: 'Oct', gain: 22 },
    { month: 'Nov', gain: 25 },
    { month: 'Dec', gain: 28 },
    { month: 'Jan', gain: 31 },
    { month: 'Feb', gain: 34 },
  ],
}

export const userProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  joinDate: 'September 2025',
  avatar: 'AJ',
  totalAnalyses: 247,
  savedProjects: 6,
  avgConfidenceScore: 87,
  preferredLanguage: 'Python',
  role: 'Senior Developer',
}

export const analysisModes = [
  { id: 'bug', name: 'Bug Detection', icon: '🐛', description: 'Find bugs and logical errors in your code', color: 'from-red-500 to-orange-500' },
  { id: 'security', name: 'Security Scan', icon: '🔒', description: 'Detect security vulnerabilities and risks', color: 'from-yellow-500 to-red-500' },
  { id: 'performance', name: 'Performance', icon: '⚡', description: 'Identify performance bottlenecks and optimizations', color: 'from-yellow-400 to-orange-500' },
  { id: 'cleanup', name: 'Code Cleanup', icon: '✨', description: 'Clean up code style and remove dead code', color: 'from-blue-400 to-cyan-500' },
  { id: 'refactor', name: 'Refactor Mode', icon: '🔄', description: 'Suggest refactoring patterns and improvements', color: 'from-purple-500 to-pink-500' },
  { id: 'complexity', name: 'Complexity Analysis', icon: '📊', description: 'Analyze cyclomatic and cognitive complexity', color: 'from-green-500 to-emerald-500' },
]

export const projectDetailData = {
  1: {
    analyses: [
      { id: 1, title: 'auth_service.py', mode: 'Security Scan', date: '2026-02-25', confidence: 91, issues: 4 },
      { id: 2, title: 'payment_handler.py', mode: 'Bug Detection', date: '2026-02-23', confidence: 88, issues: 2 },
      { id: 3, title: 'user_model.py', mode: 'Code Cleanup', date: '2026-02-21', confidence: 94, issues: 1 },
      { id: 4, title: 'api_routes.py', mode: 'Performance', date: '2026-02-18', confidence: 82, issues: 3 },
    ],
    files: [
      { name: 'auth_service.py', language: 'Python', lastAnalyzed: '2026-02-25', issues: 4 },
      { name: 'payment_handler.py', language: 'Python', lastAnalyzed: '2026-02-23', issues: 2 },
      { name: 'user_model.py', language: 'Python', lastAnalyzed: '2026-02-21', issues: 1 },
      { name: 'api_routes.py', language: 'Python', lastAnalyzed: '2026-02-18', issues: 3 },
      { name: 'database.sql', language: 'SQL', lastAnalyzed: '2026-02-15', issues: 0 },
    ],
  },
  2: {
    analyses: [
      { id: 1, title: 'JwtService.java', mode: 'Security Scan', date: '2026-02-22', confidence: 89, issues: 3 },
      { id: 2, title: 'AuthController.java', mode: 'Bug Detection', date: '2026-02-20', confidence: 85, issues: 2 },
      { id: 3, title: 'RedisConfig.java', mode: 'Performance', date: '2026-02-18', confidence: 91, issues: 1 },
    ],
    files: [
      { name: 'JwtService.java', language: 'Java', lastAnalyzed: '2026-02-22', issues: 3 },
      { name: 'AuthController.java', language: 'Java', lastAnalyzed: '2026-02-20', issues: 2 },
      { name: 'RedisConfig.java', language: 'Java', lastAnalyzed: '2026-02-18', issues: 1 },
      { name: 'Dockerfile', language: 'Docker', lastAnalyzed: '2026-02-15', issues: 0 },
    ],
  },
  3: {
    analyses: [
      { id: 1, title: 'renderer.cpp', mode: 'Performance', date: '2026-02-18', confidence: 78, issues: 5 },
      { id: 2, title: 'websocket_server.cpp', mode: 'Bug Detection', date: '2026-02-16', confidence: 82, issues: 3 },
      { id: 3, title: 'data_stream.cpp', mode: 'Complexity Analysis', date: '2026-02-14', confidence: 76, issues: 4 },
    ],
    files: [
      { name: 'renderer.cpp', language: 'C++', lastAnalyzed: '2026-02-18', issues: 5 },
      { name: 'websocket_server.cpp', language: 'C++', lastAnalyzed: '2026-02-16', issues: 3 },
      { name: 'data_stream.cpp', language: 'C++', lastAnalyzed: '2026-02-14', issues: 4 },
      { name: 'chart_engine.cpp', language: 'C++', lastAnalyzed: '2026-02-12', issues: 2 },
    ],
  },
  4: {
    analyses: [
      { id: 1, title: 'ingestion.py', mode: 'Performance', date: '2026-02-15', confidence: 88, issues: 2 },
      { id: 2, title: 'preprocessor.py', mode: 'Bug Detection', date: '2026-02-13', confidence: 91, issues: 1 },
      { id: 3, title: 'feature_eng.py', mode: 'Complexity Analysis', date: '2026-02-11', confidence: 84, issues: 3 },
    ],
    files: [
      { name: 'ingestion.py', language: 'Python', lastAnalyzed: '2026-02-15', issues: 2 },
      { name: 'preprocessor.py', language: 'Python', lastAnalyzed: '2026-02-13', issues: 1 },
      { name: 'feature_eng.py', language: 'Python', lastAnalyzed: '2026-02-11', issues: 3 },
    ],
  },
  5: {
    analyses: [
      { id: 1, title: 'gateway_config.java', mode: 'Security Scan', date: '2026-02-10', confidence: 87, issues: 2 },
      { id: 2, title: 'rate_limiter.java', mode: 'Performance', date: '2026-02-08', confidence: 90, issues: 1 },
    ],
    files: [
      { name: 'gateway_config.java', language: 'Java', lastAnalyzed: '2026-02-10', issues: 2 },
      { name: 'rate_limiter.java', language: 'Java', lastAnalyzed: '2026-02-08', issues: 1 },
      { name: 'kong.yaml', language: 'YAML', lastAnalyzed: '2026-02-06', issues: 0 },
    ],
  },
  6: {
    analyses: [
      { id: 1, title: 'entity_system.cpp', mode: 'Complexity Analysis', date: '2026-02-08', confidence: 75, issues: 6 },
      { id: 2, title: 'physics_engine.cpp', mode: 'Performance', date: '2026-02-06', confidence: 80, issues: 4 },
      { id: 3, title: 'renderer_core.cpp', mode: 'Bug Detection', date: '2026-02-04', confidence: 77, issues: 3 },
      { id: 4, title: 'input_handler.cpp', mode: 'Code Cleanup', date: '2026-02-02', confidence: 88, issues: 1 },
    ],
    files: [
      { name: 'entity_system.cpp', language: 'C++', lastAnalyzed: '2026-02-08', issues: 6 },
      { name: 'physics_engine.cpp', language: 'C++', lastAnalyzed: '2026-02-06', issues: 4 },
      { name: 'renderer_core.cpp', language: 'C++', lastAnalyzed: '2026-02-04', issues: 3 },
      { name: 'input_handler.cpp', language: 'C++', lastAnalyzed: '2026-02-02', issues: 1 },
      { name: 'audio_system.cpp', language: 'C++', lastAnalyzed: '2026-01-30', issues: 2 },
    ],
  },
}

export const searchResults = [
  { id: 1, title: 'user_auth.py', type: 'Analysis', description: 'Bug Detection — Python', date: '2026-02-25' },
  { id: 2, title: 'E-Commerce Backend', type: 'Project', description: 'FastAPI backend — 24 files', date: '2026-02-25' },
  { id: 3, title: 'UserService.java', type: 'Analysis', description: 'Security Scan — Java', date: '2026-02-24' },
  { id: 4, title: 'ML Pipeline', type: 'Project', description: 'Data pipeline — 18 files', date: '2026-02-15' },
  { id: 5, title: 'main.cpp', type: 'Analysis', description: 'Performance Optimization — C++', date: '2026-02-23' },
  { id: 6, title: 'Microservices Auth', type: 'Project', description: 'JWT auth — 12 files', date: '2026-02-22' },
]
