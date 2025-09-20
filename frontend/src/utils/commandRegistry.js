// Command registry for dynamic suggestions and auto-completion
export const commandRegistry = {
  // System commands
  system: {
    'ls': {
      description: 'List directory contents',
      usage: 'ls [options] [path]',
      examples: ['ls', 'ls -la', 'ls /home'],
      category: 'file-system'
    },
    'cd': {
      description: 'Change directory',
      usage: 'cd [directory]',
      examples: ['cd /home', 'cd ..', 'cd ~'],
      category: 'file-system'
    },
    'pwd': {
      description: 'Print working directory',
      usage: 'pwd',
      examples: ['pwd'],
      category: 'file-system'
    },
    'mkdir': {
      description: 'Create directory',
      usage: 'mkdir [options] directory_name',
      examples: ['mkdir new_folder', 'mkdir -p path/to/folder'],
      category: 'file-system'
    },
    'rm': {
      description: 'Remove files or directories',
      usage: 'rm [options] file_or_directory',
      examples: ['rm file.txt', 'rm -rf folder'],
      category: 'file-system'
    },
    'cp': {
      description: 'Copy files or directories',
      usage: 'cp [options] source destination',
      examples: ['cp file.txt backup.txt', 'cp -r folder/ backup/'],
      category: 'file-system'
    },
    'mv': {
      description: 'Move or rename files',
      usage: 'mv [options] source destination',
      examples: ['mv old.txt new.txt', 'mv file.txt folder/'],
      category: 'file-system'
    },
    'cat': {
      description: 'Display file contents',
      usage: 'cat [options] file',
      examples: ['cat file.txt', 'cat -n file.txt'],
      category: 'file-system'
    },
    'grep': {
      description: 'Search text patterns',
      usage: 'grep [options] pattern file',
      examples: ['grep "error" log.txt', 'grep -r "function" src/'],
      category: 'text-processing'
    },
    'find': {
      description: 'Search for files',
      usage: 'find [path] [expression]',
      examples: ['find . -name "*.js"', 'find /home -type f -size +100M'],
      category: 'file-system'
    },
    'ps': {
      description: 'Display running processes',
      usage: 'ps [options]',
      examples: ['ps', 'ps aux', 'ps -ef'],
      category: 'system'
    },
    'top': {
      description: 'Display system processes',
      usage: 'top',
      examples: ['top'],
      category: 'system'
    },
    'kill': {
      description: 'Terminate processes',
      usage: 'kill [options] PID',
      examples: ['kill 1234', 'kill -9 1234'],
      category: 'system'
    },
    'chmod': {
      description: 'Change file permissions',
      usage: 'chmod [options] mode file',
      examples: ['chmod 755 script.sh', 'chmod +x file'],
      category: 'file-system'
    },
    'chown': {
      description: 'Change file ownership',
      usage: 'chown [options] owner file',
      examples: ['chown user file.txt', 'chown user:group file.txt'],
      category: 'file-system'
    }
  },

  // Git commands
  git: {
    'git status': {
      description: 'Show working tree status',
      usage: 'git status [options]',
      examples: ['git status', 'git status -s'],
      category: 'version-control'
    },
    'git add': {
      description: 'Add files to staging area',
      usage: 'git add [options] <file>',
      examples: ['git add .', 'git add file.txt', 'git add -A'],
      category: 'version-control'
    },
    'git commit': {
      description: 'Record changes to repository',
      usage: 'git commit [options]',
      examples: ['git commit -m "message"', 'git commit -am "message"'],
      category: 'version-control'
    },
    'git push': {
      description: 'Push changes to remote repository',
      usage: 'git push [options] [remote] [branch]',
      examples: ['git push', 'git push origin main', 'git push -u origin main'],
      category: 'version-control'
    },
    'git pull': {
      description: 'Fetch and merge from remote repository',
      usage: 'git pull [options] [remote] [branch]',
      examples: ['git pull', 'git pull origin main'],
      category: 'version-control'
    },
    'git branch': {
      description: 'List, create, or delete branches',
      usage: 'git branch [options] [branch]',
      examples: ['git branch', 'git branch new-feature', 'git branch -d old-branch'],
      category: 'version-control'
    },
    'git checkout': {
      description: 'Switch branches or restore files',
      usage: 'git checkout [options] <branch>',
      examples: ['git checkout main', 'git checkout -b new-branch'],
      category: 'version-control'
    },
    'git merge': {
      description: 'Merge branches',
      usage: 'git merge [options] <branch>',
      examples: ['git merge feature-branch', 'git merge --no-ff feature-branch'],
      category: 'version-control'
    },
    'git log': {
      description: 'Show commit history',
      usage: 'git log [options]',
      examples: ['git log', 'git log --oneline', 'git log --graph'],
      category: 'version-control'
    },
    'git diff': {
      description: 'Show changes between commits',
      usage: 'git diff [options]',
      examples: ['git diff', 'git diff --staged', 'git diff HEAD~1'],
      category: 'version-control'
    }
  },

  // AI commands
  ai: {
    'ai help': {
      description: 'Show AI command help',
      usage: 'ai help [command]',
      examples: ['ai help', 'ai help explain'],
      category: 'ai'
    },
    'ai explain': {
      description: 'Explain a concept or command',
      usage: 'ai explain <topic>',
      examples: ['ai explain git merge', 'ai explain how to use docker'],
      category: 'ai'
    },
    'ai generate': {
      description: 'Generate code or content',
      usage: 'ai generate <type> <description>',
      examples: ['ai generate react component', 'ai generate python function'],
      category: 'ai'
    },
    'ai debug': {
      description: 'Debug code or error',
      usage: 'ai debug <code_or_error>',
      examples: ['ai debug "error: cannot find module"', 'ai debug my_code.js'],
      category: 'ai'
    },
    'ai optimize': {
      description: 'Optimize code or performance',
      usage: 'ai optimize <code_or_description>',
      examples: ['ai optimize my_function', 'ai optimize database query'],
      category: 'ai'
    },
    'ai translate': {
      description: 'Translate text or code',
      usage: 'ai translate <text> [language]',
      examples: ['ai translate "hello world" spanish', 'ai translate my_code python'],
      category: 'ai'
    }
  },

  // Development commands
  dev: {
    'npm install': {
      description: 'Install dependencies',
      usage: 'npm install [package]',
      examples: ['npm install', 'npm install react', 'npm install -g typescript'],
      category: 'package-manager'
    },
    'npm start': {
      description: 'Start development server',
      usage: 'npm start',
      examples: ['npm start'],
      category: 'package-manager'
    },
    'npm run': {
      description: 'Run npm scripts',
      usage: 'npm run <script>',
      examples: ['npm run build', 'npm run test', 'npm run dev'],
      category: 'package-manager'
    },
    'docker build': {
      description: 'Build Docker image',
      usage: 'docker build [options] <path>',
      examples: ['docker build .', 'docker build -t myapp .'],
      category: 'containerization'
    },
    'docker run': {
      description: 'Run Docker container',
      usage: 'docker run [options] <image>',
      examples: ['docker run nginx', 'docker run -p 3000:3000 myapp'],
      category: 'containerization'
    },
    'python': {
      description: 'Run Python interpreter or script',
      usage: 'python [options] <script>',
      examples: ['python', 'python script.py', 'python -m pip install package'],
      category: 'programming'
    },
    'node': {
      description: 'Run Node.js script',
      usage: 'node [options] <script>',
      examples: ['node', 'node app.js', 'node --version'],
      category: 'programming'
    }
  }
};

// Get suggestions based on partial input
export const getSuggestions = (input, maxSuggestions = 10) => {
  if (!input || input.length < 1) return [];

  const suggestions = [];
  const inputLower = input.toLowerCase();

  // Search through all command categories
  Object.values(commandRegistry).forEach(category => {
    Object.entries(category).forEach(([command, info]) => {
      if (command.toLowerCase().includes(inputLower)) {
        suggestions.push({
          command,
          description: info.description,
          usage: info.usage,
          examples: info.examples,
          category: info.category
        });
      }
    });
  });

  // Sort by relevance (exact matches first, then by length)
  suggestions.sort((a, b) => {
    const aExact = a.command.toLowerCase().startsWith(inputLower);
    const bExact = b.command.toLowerCase().startsWith(inputLower);
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    return a.command.length - b.command.length;
  });

  return suggestions.slice(0, maxSuggestions);
};

// Get command info
export const getCommandInfo = (command) => {
  for (const category of Object.values(commandRegistry)) {
    if (category[command]) {
      return category[command];
    }
  }
  return null;
};

// Get commands by category
export const getCommandsByCategory = (category) => {
  const result = [];
  Object.values(commandRegistry).forEach(cat => {
    Object.entries(cat).forEach(([command, info]) => {
      if (info.category === category) {
        result.push({ command, ...info });
      }
    });
  });
  return result;
};

// Get all categories
export const getCategories = () => {
  const categories = new Set();
  Object.values(commandRegistry).forEach(cat => {
    Object.values(cat).forEach(info => {
      categories.add(info.category);
    });
  });
  return Array.from(categories);
};

