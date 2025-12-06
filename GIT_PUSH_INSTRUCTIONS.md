# 🚀 Push EcoMonitor to GitHub

## Step-by-Step Instructions

### 1. Initialize Git Repository (if not already done)

```bash
git init
```

### 2. Add Remote Repository

```bash
git remote add origin https://github.com/solanoypatricia02/EcoMonitor.git
```

### 3. Check Current Status

```bash
git status
```

This will show you which files will be committed. Make sure sensitive files are NOT listed:
- ❌ `esp32_firmware/config.h` (contains WiFi password)
- ❌ `python_backend/.env` (contains Firebase URL)
- ✅ `esp32_firmware/config.h.example` (should be included)
- ✅ `python_backend/.env.example` (should be included)

### 4. Add All Files

```bash
git add .
```

### 5. Commit Changes

```bash
git commit -m "Initial commit: EcoMonitor Environmental Monitoring System

Features:
- ESP32 firmware with DHT22 and MQ135 sensors
- Firebase Realtime Database integration
- Modern PWA web dashboard with real-time charts
- Smart alert system with visual and audio notifications
- Heartbeat animations for critical states
- Custom threshold configuration
- Data export (CSV/PDF) with AI insights
- Predictive analytics
- Dark mode support
- Python backend for analysis
- Comprehensive documentation"
```

### 6. Push to GitHub

```bash
git push -u origin main
```

**If you get an error about 'main' vs 'master':**

```bash
# Rename branch to main
git branch -M main

# Then push
git push -u origin main
```

**If the repository already has content:**

```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 🔒 Security Checklist

Before pushing, verify these files are NOT being committed:

```bash
# Check what will be committed
git status

# Should NOT see:
# - esp32_firmware/config.h
# - python_backend/.env
# - Any files with passwords or API keys
```

If you see sensitive files:

```bash
# Remove from staging
git reset esp32_firmware/config.h
git reset python_backend/.env

# Add to .gitignore if not already there
echo "esp32_firmware/config.h" >> .gitignore
echo "python_backend/.env" >> .gitignore

# Commit again
git add .
git commit -m "Initial commit"
```

---

## 📝 After Pushing

### 1. Verify on GitHub
- Go to https://github.com/solanoypatricia02/EcoMonitor
- Check that all files are there
- Verify README displays correctly
- Make sure no sensitive data is visible

### 2. Add Repository Description
On GitHub:
1. Click "About" (gear icon)
2. Add description: "Real-time environmental monitoring with ESP32, Firebase, and AI-powered insights"
3. Add topics: `esp32`, `iot`, `firebase`, `environmental-monitoring`, `pwa`, `arduino`
4. Add website (if deployed)

### 3. Create LICENSE File
On GitHub:
1. Click "Add file" → "Create new file"
2. Name it `LICENSE`
3. Choose "MIT License" template
4. Commit

### 4. Enable GitHub Pages (Optional)
To host the web dashboard:
1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main, folder: /web_dashboard
4. Save
5. Your dashboard will be at: `https://solanoypatricia02.github.io/EcoMonitor/`

---

## 🔄 Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Add feature: [describe what you added]"

# Push to GitHub
git push
```

---

## 🌿 Branching Strategy (Optional)

For larger changes:

```bash
# Create feature branch
git checkout -b feature/new-sensor

# Make changes, commit
git add .
git commit -m "Add support for BME680 sensor"

# Push branch
git push -u origin feature/new-sensor

# Create Pull Request on GitHub
# After review, merge to main
```

---

## 🆘 Common Issues

### Issue: "fatal: remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add again
git remote add origin https://github.com/solanoypatricia02/EcoMonitor.git
```

### Issue: "Updates were rejected"
```bash
# Pull first
git pull origin main --rebase

# Then push
git push origin main
```

### Issue: "Permission denied"
```bash
# Make sure you're logged in to GitHub
# Use personal access token instead of password
# Or set up SSH keys
```

### Issue: Accidentally committed sensitive file
```bash
# Remove from Git history (BEFORE pushing)
git rm --cached esp32_firmware/config.h
git commit -m "Remove sensitive file"

# If already pushed, see GitHub docs on removing sensitive data
```

---

## ✅ Verification Checklist

After pushing, verify:

- [ ] Repository is public (or private as intended)
- [ ] README displays correctly with images
- [ ] No sensitive data visible (WiFi passwords, API keys)
- [ ] All documentation files are present
- [ ] Example config files are included
- [ ] .gitignore is working correctly
- [ ] Repository has description and topics
- [ ] LICENSE file is added

---

## 🎉 Success!

Your EcoMonitor project is now on GitHub!

**Share your project:**
- Add link to your portfolio
- Share on social media
- Submit to IoT project showcases
- Add to Arduino project hub

**Repository URL:**
https://github.com/solanoypatricia02/EcoMonitor

---

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages](https://pages.github.com/)
