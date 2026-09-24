# FEST'LMACHER Website

Professional catering service website built with React, Node.js, and MongoDB.

## Features

- Modern, responsive design
- Online booking system
- Admin dashboard
- Email notifications
- Google Maps integration
- SEO optimized

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JWT
- Contact and booking email: Resend via Netlify Functions
- Maps: Google Maps API

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/festlmacher-website.git
```

2. Install dependencies
```bash
npm install
```

3. Create .env file with required environment variables
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

4. Start development server
```bash
npm run dev
```

5. Start backend server
```bash
npm run server
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL
- `NODE_ENV`: Environment (development/production)

## Deployment

- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

## License

MIT

## Contact and booking email (Netlify + Resend)

Both public forms send to `/.netlify/functions/send-email`. The function sends through
Resend; the API key is never included in the browser bundle. The existing Render
backend is used only for a best-effort dashboard copy after Resend accepts the email.

Set these variables in the **Netlify site environment variables**, including the
**Functions** scope for the production deploy context, then redeploy:

- `RESEND_API_KEY`: a Resend API key with sending permission.
- `RESEND_FROM_EMAIL`: a sender on your verified Resend domain, such as
  `FEST'LMACHER <kontakt@your-verified-domain.at>`.
- `CONTACT_TO_EMAIL`: the inbox receiving submissions; defaults to `info@cateringandmore.at`.

Do not prefix these variables with `VITE_` or commit their values. The visitor's
email is set as Reply-To so replies go directly to them. Only a confirmed Resend
acceptance shows success; provider/configuration failures preserve the form inputs.
Acceptance does not guarantee inbox delivery; check delivery/bounce events in Resend.

For local end-to-end development, use `npx netlify-cli dev` with these variables in
an ignored `.env` file. Plain `npm run dev` runs only Vite, without Netlify Functions.
Run `npm run test:email` for mocked-provider regression tests and `npm run build`
for the production build. After deployment, submit each form and verify the email
contents, Reply-To, and delivery status in Resend and the receiving inbox.
