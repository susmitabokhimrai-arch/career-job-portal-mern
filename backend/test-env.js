cd backend

cat > test-env.js << 'EOF'
import dotenv from 'dotenv';
dotenv.config();

console.log("=== EMAIL CONFIG ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
console.log("===================");
EOF

node test-env.js