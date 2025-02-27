# PacePal

A personalized daily planner for managing your sleep and productivity.

## Features

- Onboarding: Create a profile and set your desired sleep hours.
- Daily Planning: Create a daily plan with your desired sleep hours and schedule.
- Daily Reflection: Reflect on your day and track your productivity.
- Sleep Tracking: Track your sleep hours and see your sleep patterns.
- Mood Tracking: Track your mood and see how it affects your productivity.
- Penalty Tracking: Track your penalty and see how it affects your productivity.
- Distraction Tracking: Track your distractions and see how it affects your productivity.

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/guru901/pacepal.git
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```bash
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/onboarding
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_SITE_URL=http://localhost:3000
DATABASE_URL=
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
