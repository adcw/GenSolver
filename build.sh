git checkout main

echo "Running build.."
npm run build

echo "Sending packages"
scp -r build/* ideo@192.168.3.12:/var/www/gensolver/public_html/
