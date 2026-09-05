# Space Invaders Clone

A modern web-based Space Invaders clone built with React and Vite.

## Features

- Classic Space Invaders gameplay
- Multiple enemy types (Basic, Fast, Armored, Boss)
- Power-ups system:
  - Rapid Fire: Increases shooting rate
  - Multi-Shot: Fires multiple bullets
  - Shield: Temporary invincibility
  - Score Multiplier: Doubles points
- Wave-based progression with increasing difficulty
- Sound effects using Web Audio API
- High score tracking (localStorage)
- Modern space-themed UI with animations

## Controls

- **Arrow Keys** or **A/D**: Move left/right
- **Spacebar**: Shoot
- **P**: Pause/Resume

## Installation

1. Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The game will open in your browser at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

Preview the production build:

```bash
npm run preview
```

## Game Mechanics

- **Lives**: Start with 3 lives
- **Waves**: Progress through waves of enemies
- **Boss Waves**: Every 5 waves features a boss enemy
- **Power-ups**: Randomly drop from destroyed enemies (15% chance)
- **Scoring**:
  - Basic enemy: 10 points
  - Fast enemy: 20 points
  - Armored enemy: 50 points
  - Boss: 500 points

## Technologies

- React 18
- Vite 5
- Web Audio API for sound effects
- CSS3 for animations and styling

## Project context

Start with [the documentation index](docs/README.md).
It links current state, structure, operations, decisions, and handoff guidance.
Keep these records aligned with reviewed changes.
