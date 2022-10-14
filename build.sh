git checkout main

echo "Running build.."
npm run build

echo "Sending packages"
scp -r build/* edorian@192.168.3.13:/var/www/GenSolver/
