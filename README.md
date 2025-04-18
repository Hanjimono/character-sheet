# DnD character sheet

This is a small personal project for playing DnD. Its main goal is to add some vibes for roleplaying a character, as well as to make it easier to keep certain notes during the game. Originally, it was planned to be just a landing page, but eventually some additional functionality was added.

For now, it's a sheet for a specific character, but the functionality is being developed with the idea that there could be multiple characters in the future.

## Planned Features

- [ ] A visually styled sheet with the right atmosphere, showing the main character info
- [ ] Interaction with `.md` files and Obsidian vaults
- [x] Ability to save certain data to a database
- [ ] Tracking dice roll stats (nat1, nat20)
- [ ] Tracking damage dealt and received
- [ ] Tracking spending and earnings
- [ ] Reminders to sort through chaotic notes made during a session
- [ ] Reminders about important notes to keep in mind during the session

## Stack

Next.js + zustand + my UI-kit + sequelize

## Build Instructions

This is a personal project and isn’t intended for public release. It's built locally on a PC and run during game sessions. Use `yarn migrate` and `yarn seed` to set up the database, then just run `yarn dev`. You might need to manually tweak the DB if the interface for some features isn’t finished yet.

Some images and markdown files with notes are not included in the repository.
