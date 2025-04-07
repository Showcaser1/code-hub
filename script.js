document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const codeEditor = document.getElementById('code-editor');
    const codeHighlight = document.getElementById('code-highlight');
    const runBtn = document.getElementById('run-btn');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const outputDiv = document.getElementById('output');
    const visualizationDiv = document.getElementById('visualization');
    const filenameInput = document.getElementById('filename');
    const languageSelect = document.getElementById('language-select');
    
    // Default examples for each language
    const languageExamples = {
        lua: `-- Welcome to Lua Editor
function greet(name)
    print("Hello, " .. name .. "!")
end

-- Example usage
greet("World")

-- Fibonacci function
function fibonacci(n)
    if n <= 1 then
        return n
    end
    return fibonacci(n - 1) + fibonacci(n - 2)
end

print("Fibonacci of 10:", fibonacci(10))`,
        
        python: `# Welcome to Python Editor
def greet(name):
    print(f"Hello, {name}!")

# Example usage
greet("World")

# Fibonacci function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci of 10: {fibonacci(10)}")`,
        
        javascript: `// Welcome to JavaScript Editor
function greet(name) {
    console.log(\`Hello, \${name}!\`);
}

// Example usage
greet("World");

// Fibonacci function
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(\`Fibonacci of 10: \${fibonacci(10)}\`);`
    };
    
    // Initialize the editor
    function initEditor() {
        // Set initial code based on selected language
        updateLanguage();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial syntax highlighting
        updateHighlight();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Language selection change
        languageSelect.addEventListener('change', updateLanguage);
        
        // Code editor input
        codeEditor.addEventListener('input', updateHighlight);
        
        // Tab key support
        codeEditor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Insert tab character
                this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
                
                // Move cursor
                this.selectionStart = this.selectionEnd = start + 1;
                
                updateHighlight();
            }
        });
        
        // Run button
        runBtn.addEventListener('click', executeCode);
        
        // Save button
        saveBtn.addEventListener('click', saveFile);
        
        // Clear button
        clearBtn.addEventListener('click', clearOutput);
    }
    
    // Update language and code example
    function updateLanguage() {
        const language = languageSelect.value;
        codeEditor.value = languageExamples[language];
        codeHighlight.className = `language-${language} line-numbers`;
        updateFilenameExtension(language);
        updateHighlight();
    }
    
    // Update filename extension based on language
    function updateFilenameExtension(language) {
        const currentFilename = filenameInput.value;
        const baseName = currentFilename.split('.')[0];
        const extensions = {
            lua: 'lua',
            python: 'py',
            javascript: 'js'
        };
        filenameInput.value = `${baseName}.${extensions[language]}`;
    }
    
    // Update syntax highlighting
    function updateHighlight() {
        const code = codeEditor.value;
        codeHighlight.innerHTML = code.replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;');
        Prism.highlightElement(codeHighlight);
    }
    
    // Execute the code
    function executeCode() {
        const language = languageSelect.value;
        const code = codeEditor.value;
        
        // Clear previous output
        outputDiv.innerHTML = '';
        visualizationDiv.innerHTML = '';
        
        // Show executing message
        outputDiv.textContent = `> Executing ${language.toUpperCase()} code...\n\n`;
        
        try {
            // Simulate execution based on language
            switch(language) {
                case 'lua':
                    executeLua(code);
                    break;
                case 'python':
                    executePython(code);
                    break;
                case 'javascript':
                    executeJavaScript(code);
                    break;
            }
        } catch (e) {
            outputDiv.textContent += `> Error: ${e.message}\n`;
        }
        
        // Scroll to bottom of output
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
    
    // Simulate Lua execution
    function executeLua(code) {
        // Find all print statements
        const printMatches = code.match(/print\(([^)]+)\)/g);
        if (printMatches) {
            printMatches.forEach(match => {
                const content = match.replace(/print\((['"]?)(.*?)\1\)/, '$2');
                outputDiv.textContent += `${content}\n`;
            });
        } else {
            outputDiv.textContent += "> Code executed (no output from print statements)\n";
        }
        
        // Create visualization
        createVisualization(code, 'lua');
    }
    
    // Simulate Python execution
    function executePython(code) {
        // Find all print statements
        const printMatches = code.match(/print\(([^)]+)\)/g);
        if (printMatches) {
            printMatches.forEach(match => {
                const content = match.replace(/print\((['"]?)(.*?)\1\)/, '$2')
                                    .replace(/f(['"])(.*?)\1/, '$2'); // Remove f-string formatting
                outputDiv.textContent += `${content}\n`;
            });
        } else {
            outputDiv.textContent += "> Code executed (no output from print statements)\n";
        }
        
        // Create visualization
        createVisualization(code, 'python');
    }
    
    // Simulate JavaScript execution
    function executeJavaScript(code) {
        // Find all console.log statements
        const logMatches = code.match(/console\.log\(([^)]+)\)/g);
        if (logMatches) {
            logMatches.forEach(match => {
                const content = match.replace(/console\.log\((['"]?)(.*?)\1\)/, '$2')
                                    .replace(/\${(.*?)}/g, '$1'); // Remove template literals
                outputDiv.textContent += `${content}\n`;
            });
        } else {
            outputDiv.textContent += "> Code executed (no output from console.log)\n";
        }
        
        // Create visualization
        createVisualization(code, 'javascript');
    }
    
    // Create code visualization
    function createVisualization(code, language) {
        // Count functions
        const functionCount = (code.match(/function/g) || []).length;
        
        // Count print/console.log statements
        const outputCount = (code.match(/(print|console\.log)\(/g) || []).length;
        
        // Count variables (simple regex, not perfect)
        const variableCount = (code.match(/(local\s+|let\s+|const\s+|var\s+)?[a-zA-Z_][a-zA-Z0-9_]*\s*=/g) || []).length;
        
        // Create visualization HTML
        visualizationDiv.innerHTML = `
            <div class="visualization-grid">
                <div class="viz-card">
                    <div class="viz-icon">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="viz-content">
                        <h4>${language.toUpperCase()} Code</h4>
                        <p>${code.split('\n').length} lines</p>
                    </div>
                </div>
                
                <div class="viz-card">
                    <div class="viz-icon">
                        <i class="fas fa-cubes"></i>
                    </div>
                    <div class="viz-content">
                        <h4>Functions</h4>
                        <p>${functionCount} defined</p>
                    </div>
                </div>
                
                <div class="viz-card">
                    <div class="viz-icon">
                        <i class="fas fa-terminal"></i>
                    </div>
                    <div class="viz-content">
                        <h4>Outputs</h4>
                        <p>${outputCount} statements</p>
                    </div>
                </div>
                
                <div class="viz-card">
                    <div class="viz-icon">
                        <i class="fas fa-memory"></i>
                    </div>
                    <div class="viz-content">
                        <h4>Variables</h4>
                        <p>${variableCount} detected</p>
                    </div>
                </div>
            </div>
            
            <div class="execution-flow">
                <h4>Execution Flow</h4>
                <div class="flow-steps">
                    <div class="flow-step">
                        <div class="step-number">1</div>
                        <div class="step-desc">Code parsed</div>
                    </div>
                    <div class="flow-step">
                        <div class="step-number">2</div>
                        <div class="step-desc">${functionCount} functions loaded</div>
                    </div>
                    <div class="flow-step">
                        <div class="step-number">3</div>
                        <div class="step-desc">Main execution started</div>
                    </div>
                    <div class="flow-step">
                        <div class="step-number">4</div>
                        <div class="step-desc">${outputCount} outputs generated</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Save file
    function saveFile() {
        const code = codeEditor.value;
        const filename = filenameInput.value;
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Clear output
    function clearOutput() {
        outputDiv.innerHTML = '';
        visualizationDiv.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-running"></i>
                <p>Run your code to see visualization</p>
            </div>
        `;
    }
    
    // Initialize the editor
    initEditor();
});
