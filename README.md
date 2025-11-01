# test1nov

A minimal HTML/CSS/JS starter project for creating simple landing pages or prototypes.
This repository contains a basic structure for a static site that you can easily customize or extend.

---

## ✨ Features

* Lightweight static site (no frameworks or build tools)
* Clean separation of HTML, CSS, and JavaScript
* Fully deployable to GitHub Pages, AWS S3, or any static host
* Ideal for quick mockups, demos, or personal portfolio pages

---

## 📁 Project Structure

```
.
├── index.html      # Main HTML page
├── styles.css      # Stylesheet
├── script.js       # JavaScript logic
└── assets/         # (Optional) Images, icons, or fonts
```

---

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/masoudog/test1nov.git
cd test1nov
```

### 2. Run locally

Open `index.html` in your browser directly, or use a simple local server:

**Python**

```bash
python3 -m http.server 5173
```

**Node.js**

```bash
npx http-server -p 5173
```

Then open: `http://localhost:5173`

---

## 🧩 Customization

* Edit text and content in `index.html`
* Modify visual styles in `styles.css`
* Add JavaScript functionality in `script.js`
* Add images and media under the `assets/` directory

---

## 🌐 Deployment

### A) GitHub Pages

1. Push your code to the `main` branch.
2. Go to **Settings → Pages → Build and deployment**.
3. Select **Deploy from a branch → main → / (root)**.
4. Save — GitHub will publish your page automatically.

Example URL:

```
https://masoudog.github.io/test1nov/
```

### B) AWS S3 + CloudFront

1. Create an S3 bucket for static website hosting.
2. Upload your site files (`index.html`, `styles.css`, etc.).
3. (Optional) Use CloudFront for global CDN distribution.
4. Enable HTTPS via ACM certificate if using a custom domain.

---

## 🧱 Future Improvements

* [ ] Add SEO-friendly meta tags
* [ ] Include responsive navigation
* [ ] Add a simple contact form with validation
* [ ] Automate deployment with GitHub Actions or AWS CLI

---

## 🤝 Contributing

Feel free to fork, open issues, or submit pull requests.
Suggestions for improvements are always welcome.

---

## 📝 License

This project is licensed under the **MIT License**.
© 2025 [Masoud](https://github.com/masoudog)

---
