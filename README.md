# Branch Fest 2025 Website

Static, responsive website for a college branch event. Built with vanilla HTML/CSS/JS. Includes Home, Schedule, Events, Contact pages, Code of Conduct, dark mode, and basic interactions.

## Local preview

Open `index.html` in your browser. Or serve locally:

```bash
python3 -m http.server 8080 --directory .
```

Visit `http://localhost:8080`.

## Deploy free on GitHub Pages

1. Create a new GitHub repo and push this folder:
```bash
git init
git branch -M main
git remote add origin https://github.com/<you>/branch-fest-2025.git
git add .
git commit -m "Initialize site"
git push -u origin main
```
2. In GitHub: Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` (`/root`). Save.
3. Your site will be live at `https://<you>.github.io/branch-fest-2025/` in ~1 minute.

### Custom domain (optional)
Add a `CNAME` file with your domain and point DNS to GitHub Pages.

## Customize
- Update event date in `index.html` `data-countdown`.
- Replace placeholder emails, venue links, and registration URLs.
- Put logos/social preview in `assets/img/` and update `og:image`.

## License
MIT

