const { execSync } = require('child_process');
const path = require('path');

// Configuration
const repoUrl = 'https://github.com/steampunk99/eug.git';
const commitMessages = {
    frontend: `Frontend Application:
- Modern React-based UI with Material-UI components
- Authentication system with session management
- Student management dashboard with CRUD operations
- School profile and application management
- Real-time notifications using toast messages
- Responsive design for all screen sizes
- Role-based access control for different user types
- Integration with backend APIs`,
    
    backend: `Backend Application:
- Express.js server with MongoDB integration
- RESTful API endpoints for all operations
- Authentication system with Passport.js
- Session management and security
- Student enrollment and management system
- School application processing
- Role-based middleware for authorization
- Error handling and logging system`
};

function execCommand(command, cwd) {
    try {
        execSync(command, { cwd, stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

function initializeRepository() {
    const rootDir = path.resolve(__dirname);
    
    console.log('Initializing repository...');
    
    // Initialize git in root directory
    execCommand('git init', rootDir);
    
    // Add and commit frontend
    console.log('\nCommitting frontend...');
    execCommand('git add frontend/*', rootDir);
    execCommand(`git commit -m "${commitMessages.frontend}"`, rootDir);
    
    // Add and commit backend
    console.log('\nCommitting backend...');
    execCommand('git add backend/*', rootDir);
    execCommand(`git commit -m "${commitMessages.backend}"`, rootDir);
    
    // Set up remote and push
    console.log('\nPushing to remote repository...');
    execCommand('git branch -M main', rootDir);
    execCommand(`git remote add origin ${repoUrl}`, rootDir);
    execCommand('git push -f -u origin main', rootDir);
    
    console.log('\nRepository initialization complete!');
}

// Run the initialization
initializeRepository();
