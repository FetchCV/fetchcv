# FetchCV

FetchCV is a centralized place for developers to collect and present their work. It currently connects to GitHub, but will also connect to GitLab, Replit, Codepen, and other platforms that developers use to display all of their work in one place. With accounts, developers can add more information to create a full bio.


# How do I set it up?
Once you have the repository set up locally, you will need to install the dependencies. This can be done by running `npm install`. To run the project, you can run `npm start` and the project will start on `localhost:8080`. For development, there are a few commands to know:
- `npm run dev` will run nodemon, so any changes to javascript files will restart the server
- `npm run watch` will watch for both tailwind and typescript, updating styles and compiling when needed (you can run each by itself with `watch-tailwind` and `watch-typescript`)
- `npm run watch-all` will be the best option in most scenarios, as it will run both of the above commands at the same time, leaving you free to edit without worrying about restarting, compiling, or updating styles
