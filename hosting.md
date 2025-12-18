# AutoMedic React App - Docker Deployment on Hostinger VPS

This guide will help you deploy the AutoMedic React application on your Hostinger VPS using Docker.

## Prerequisites

- Hostinger VPS with Ubuntu/Debian
- SSH access to your VPS
- Domain name (optional, but recommended)
- Root or sudo access

## Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

## Step 2: Install Docker and Docker Compose

### Install Docker

```bash
# Update package index
sudo apt-get update

# Install required packages
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Verify Docker installation
docker --version
```

### Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Apply executable permissions
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Enable Docker to start on boot

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

## Step 3: Transfer Your Application to VPS

### Option A: Using Git (Recommended)

```bash
# Install git if not already installed
sudo apt-get install -y git

# Clone your repository
cd /opt
sudo git clone https://github.com/yourusername/automedic.git
cd automedic

# Or if you need to pull latest changes
git pull origin main
```

### Option B: Using SCP (Direct file transfer)

From your local machine:

```bash
# Compress the project folder
cd /Users/Mitul/Desktop
tar -czf dash.tar.gz dash/

# Transfer to VPS
scp dash.tar.gz root@your-vps-ip:/opt/

# On VPS, extract the files
ssh root@your-vps-ip
cd /opt
tar -xzf dash.tar.gz
mv dash automedic
cd automedic
```

### Option C: Using SFTP

Use an SFTP client like FileZilla to upload the entire project folder to `/opt/automedic` on your VPS.

## Step 4: Configure Environment Variables

Create a `.env` file if needed for API endpoints:

```bash
cd /opt/automedic
nano .env
```

Add your environment variables:

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENV=production
```

## Step 5: Build and Run with Docker

### Using Docker Compose (Recommended)

```bash
cd /opt/automedic

# Build and start the container
sudo docker-compose up -d --build

# Check if container is running
sudo docker-compose ps

# View logs
sudo docker-compose logs -f
```

### Using Docker directly

```bash
cd /opt/automedic

# Build the image
sudo docker build -t automedic-app:latest .

# Run the container
sudo docker run -d \
  --name automedic-app \
  --restart unless-stopped \
  -p 80:80 \
  automedic-app:latest

# Check if container is running
sudo docker ps

# View logs
sudo docker logs -f automedic-app
```

## Step 6: Configure Firewall (UFW)

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (if using SSL)
sudo ufw allow 443/tcp

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 7: Access Your Application

Open your browser and navigate to:
- `http://your-vps-ip` or
- `http://your-domain.com` (if you have a domain configured)

## Step 8: Setup Domain and SSL (Optional but Recommended)

### Install Nginx as Reverse Proxy

```bash
sudo apt-get install -y nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/automedic
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/automedic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Install SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure HTTPS and set up auto-renewal
```

## Useful Docker Commands

### View running containers
```bash
sudo docker ps
```

### Stop the application
```bash
sudo docker-compose down
# or
sudo docker stop automedic-app
```

### Restart the application
```bash
sudo docker-compose restart
# or
sudo docker restart automedic-app
```

### View logs
```bash
sudo docker-compose logs -f
# or
sudo docker logs -f automedic-app
```

### Rebuild after code changes
```bash
sudo docker-compose down
sudo docker-compose up -d --build
```

### Remove old images
```bash
sudo docker image prune -a
```

### Check container health
```bash
sudo docker inspect automedic-app | grep -A 10 Health
```

## Updating Your Application

### Using Git

```bash
cd /opt/automedic
sudo git pull origin main
sudo docker-compose down
sudo docker-compose up -d --build
```

### Manual file transfer

1. Transfer new files to VPS
2. Rebuild and restart:

```bash
cd /opt/automedic
sudo docker-compose down
sudo docker-compose up -d --build
```

## Monitoring and Maintenance

### Check disk space
```bash
df -h
```

### Monitor Docker resources
```bash
sudo docker stats
```

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Set up automatic backups (Recommended)

```bash
# Create backup script
sudo nano /usr/local/bin/backup-automedic.sh
```

Add the following:

```bash
#!/bin/bash
BACKUP_DIR="/backup/automedic"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /opt
tar -czf $BACKUP_DIR/automedic_$DATE.tar.gz automedic/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "automedic_*.tar.gz" -mtime +7 -delete
```

Make it executable and schedule with cron:

```bash
sudo chmod +x /usr/local/bin/backup-automedic.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-automedic.sh
```

## Troubleshooting

### Container won't start

Check logs:
```bash
sudo docker-compose logs
```

### Port 80 already in use

Find what's using the port:
```bash
sudo netstat -tulpn | grep :80
sudo lsof -i :80
```

Kill the process or change the port in docker-compose.yml

### Application not accessible

Check firewall:
```bash
sudo ufw status
```

Check if container is running:
```bash
sudo docker ps
```

Check Nginx status:
```bash
sudo systemctl status nginx
```

### Out of disk space

Clean Docker system:
```bash
sudo docker system prune -a --volumes
```

## Security Best Practices

1. Keep Docker and system packages updated:
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

2. Use non-root user for Docker (optional):
   ```bash
   sudo usermod -aG docker $USER
   ```

3. Enable automatic security updates:
   ```bash
   sudo apt-get install -y unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

4. Set up fail2ban for SSH protection:
   ```bash
   sudo apt-get install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

5. Regularly backup your data and application

## Support and Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose Documentation: https://docs.docker.com/compose/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- Hostinger VPS Tutorials: https://www.hostinger.com/tutorials/vps

## Quick Reference

```bash
# Start application
sudo docker-compose up -d

# Stop application
sudo docker-compose down

# Restart application
sudo docker-compose restart

# View logs
sudo docker-compose logs -f

# Rebuild after changes
sudo docker-compose up -d --build

# Check status
sudo docker-compose ps
```

---

For any issues or questions, refer to the troubleshooting section or check the Docker logs for detailed error messages.
