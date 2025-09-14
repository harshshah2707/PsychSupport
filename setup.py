#!/usr/bin/env python3
"""
Setup script for Psychological Support System with Crisis Detection
This script sets up the complete system with Python backend and Firebase integration
"""

import os
import sys
import subprocess
import json
import shutil
from pathlib import Path

class SystemSetup:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / 'backend'
        self.frontend_dir = self.root_dir
        
    def print_step(self, step, message):
        print(f"\n{'='*50}")
        print(f"STEP {step}: {message}")
        print(f"{'='*50}")
        
    def run_command(self, command, cwd=None):
        """Run a shell command and return the result"""
        try:
            if cwd is None:
                cwd = self.root_dir
            result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
            if result.returncode != 0:
                print(f"Error running command: {command}")
                print(f"Error output: {result.stderr}")
                return False
            return True
        except Exception as e:
            print(f"Exception running command {command}: {e}")
            return False
    
    def check_python_version(self):
        """Check if Python 3.8+ is installed"""
        self.print_step(1, "Checking Python Version")
        
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print("❌ Python 3.8 or higher is required")
            print(f"Current version: {version.major}.{version.minor}")
            return False
        
        print(f"✅ Python {version.major}.{version.minor} detected")
        return True
    
    def check_node_version(self):
        """Check if Node.js is installed"""
        self.print_step(2, "Checking Node.js Version")
        
        try:
            result = subprocess.run(['node', '--version'], capture_output=True, text=True)
            if result.returncode == 0:
                version = result.stdout.strip()
                print(f"✅ Node.js {version} detected")
                return True
            else:
                print("❌ Node.js not found")
                return False
        except FileNotFoundError:
            print("❌ Node.js not found")
            print("Please install Node.js from https://nodejs.org/")
            return False
    
    def setup_python_backend(self):
        """Setup Python backend with virtual environment"""
        self.print_step(3, "Setting up Python Backend")
        
        # Create backend directory if it doesn't exist
        self.backend_dir.mkdir(exist_ok=True)
        
        # Create virtual environment
        venv_path = self.backend_dir / 'venv'
        if not venv_path.exists():
            print("Creating virtual environment...")
            if not self.run_command(f"python -m venv {venv_path}"):
                return False
        
        # Activate virtual environment and install dependencies
        if os.name == 'nt':  # Windows
            pip_path = venv_path / 'Scripts' / 'pip.exe'
        else:  # Unix/Linux/macOS
            pip_path = venv_path / 'bin' / 'pip'
        
        print("Installing Python dependencies...")
        requirements_file = self.backend_dir / 'requirements.txt'
        if requirements_file.exists():
            if not self.run_command(f"\"{pip_path}\" install -r \"{requirements_file}\""):
                return False
        else:
            print("❌ requirements.txt not found in backend directory")
            return False
        
        print("✅ Python backend setup completed")
        return True
    
    def setup_react_frontend(self):
        """Setup React frontend dependencies"""
        self.print_step(4, "Setting up React Frontend")
        
        print("Installing React dependencies...")
        if not self.run_command("npm install"):
            return False
        
        # Install additional Firebase dependencies
        firebase_deps = [
            "firebase@^9.22.0",
            "@firebase/app@^0.9.13",
            "@firebase/auth@^0.23.2",
            "@firebase/firestore@^3.12.0",
            "@firebase/messaging@^0.12.4"
        ]
        
        print("Installing Firebase dependencies...")
        for dep in firebase_deps:
            if not self.run_command(f"npm install {dep}"):
                print(f"Warning: Failed to install {dep}")
        
        print("✅ React frontend setup completed")
        return True
    
    def create_env_files(self):
        """Create environment files with templates"""
        self.print_step(5, "Creating Environment Files")
        
        # Backend .env file
        backend_env = self.backend_dir / '.env'
        if not backend_env.exists():
            env_content = '''# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Crisis Detection Configuration
CRISIS_ALERT_THRESHOLD=7
BACKGROUND_MONITORING_ENABLED=True

# Email Configuration (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# External APIs (optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
'''
            backend_env.write_text(env_content)
            print("✅ Created backend/.env file")
        
        # Frontend .env file
        frontend_env = self.frontend_dir / '.env'
        if not frontend_env.exists():
            env_content = '''# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Crisis Detection Configuration
REACT_APP_CRISIS_MONITORING_ENABLED=true
REACT_APP_CRISIS_CHECK_INTERVAL=30000

# Environment
REACT_APP_ENV=development
'''
            frontend_env.write_text(env_content)
            print("✅ Created .env file")
        
        return True
    
    def create_firebase_service_account_template(self):
        """Create Firebase service account template"""
        self.print_step(6, "Creating Firebase Service Account Template")
        
        service_account_file = self.backend_dir / 'firebase-service-account.json.template'
        if not service_account_file.exists():
            template_content = {
                "type": "service_account",
                "project_id": "your-project-id",
                "private_key_id": "your-private-key-id",
                "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n",
                "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
                "client_id": "your-client-id",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com",
                "universe_domain": "googleapis.com"
            }
            
            with open(service_account_file, 'w') as f:
                json.dump(template_content, f, indent=2)
            
            print("✅ Created firebase-service-account.json.template")
            print("⚠️  Please rename it to firebase-service-account.json and add your actual credentials")
        
        return True
    
    def create_start_scripts(self):
        """Create convenient start scripts"""
        self.print_step(7, "Creating Start Scripts")
        
        # Windows batch file
        if os.name == 'nt':
            start_backend_bat = self.root_dir / 'start-backend.bat'
            start_backend_bat.write_text('''@echo off
echo Starting Python Backend...
cd backend
venv\\Scripts\\activate && python app.py
pause
''')
            
            start_frontend_bat = self.root_dir / 'start-frontend.bat'
            start_frontend_bat.write_text('''@echo off
echo Starting React Frontend...
npm start
pause
''')
            
            start_all_bat = self.root_dir / 'start-all.bat'
            start_all_bat.write_text('''@echo off
echo Starting Complete Crisis Detection System...
start "Backend Server" start-backend.bat
timeout /t 3 /nobreak
start "Frontend Server" start-frontend.bat
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
''')
            
            print("✅ Created Windows start scripts")
        
        # Unix shell scripts
        start_backend_sh = self.root_dir / 'start-backend.sh'
        start_backend_sh.write_text('''#!/bin/bash
echo "Starting Python Backend..."
cd backend
source venv/bin/activate
python app.py
''')
        
        start_frontend_sh = self.root_dir / 'start-frontend.sh'
        start_frontend_sh.write_text('''#!/bin/bash
echo "Starting React Frontend..."
npm start
''')
        
        start_all_sh = self.root_dir / 'start-all.sh'
        start_all_sh.write_text('''#!/bin/bash
echo "Starting Complete Crisis Detection System..."
./start-backend.sh &
sleep 3
./start-frontend.sh &
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
wait
''')
        
        # Make shell scripts executable
        try:
            os.chmod(start_backend_sh, 0o755)
            os.chmod(start_frontend_sh, 0o755)
            os.chmod(start_all_sh, 0o755)
        except:
            pass  # Windows doesn't need chmod
        
        print("✅ Created Unix start scripts")
        return True
    
    def display_next_steps(self):
        """Display next steps for the user"""
        self.print_step(8, "Setup Complete - Next Steps")
        
        print("""
🎉 Setup completed successfully!

📋 NEXT STEPS:

1. 🔥 Firebase Setup:
   - Go to https://console.firebase.google.com/
   - Create a new project or select existing one
   - Enable Authentication, Firestore, and Cloud Messaging
   - Download service account key and save as backend/firebase-service-account.json
   - Update .env files with your Firebase credentials

2. 🔧 Environment Configuration:
   - Edit .env file with your Firebase configuration
   - Edit backend/.env file with your backend settings
   - Replace placeholder values with actual credentials

3. 🚀 Start the System:
   Windows: Double-click start-all.bat
   Unix/Mac: ./start-all.sh
   
   Or start individually:
   - Backend: python backend/app.py (after activating venv)
   - Frontend: npm start

4. 🧪 Test the Crisis Detection:
   - Navigate to http://localhost:3000
   - Log a mood with negative text to trigger crisis detection
   - Check browser console for real-time analysis

5. 📱 Enable Push Notifications:
   - Update VAPID key in Firebase console
   - Add VAPID key to .env file
   - Test notifications in browser

🔗 URLs:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

📖 Documentation:
   - Firebase Setup: https://firebase.google.com/docs/web/setup
   - Crisis Detection API: See backend/app.py for endpoints
   - React Components: See src/components for UI components

⚠️  IMPORTANT:
   - Never commit .env files or service account keys to version control
   - Configure Firebase security rules before production deployment
   - Test crisis detection thoroughly before production use
   - Ensure proper emergency contact procedures are in place

Need help? Check the README.md file for detailed documentation.
        """)
    
    def run_setup(self):
        """Run the complete setup process"""
        print("🔧 Psychological Support System with Crisis Detection - Setup")
        print("This will set up the complete system with Python backend and Firebase integration")
        
        steps = [
            self.check_python_version,
            self.check_node_version,
            self.setup_python_backend,
            self.setup_react_frontend,
            self.create_env_files,
            self.create_firebase_service_account_template,
            self.create_start_scripts,
            self.display_next_steps
        ]
        
        for step in steps:
            if not step():
                print(f"\n❌ Setup failed at step: {step.__name__}")
                return False
        
        print("\n✅ Setup completed successfully!")
        return True

if __name__ == "__main__":
    setup = SystemSetup()
    success = setup.run_setup()
    sys.exit(0 if success else 1)