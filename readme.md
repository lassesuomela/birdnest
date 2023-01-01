# Readme

This project is a pre-assignment for [Reaktor.com](https://www.reaktor.com/). More about the assignment [here](https://assignments.reaktor.com/birdnest).

Objective of the assignment was to build and deploy a web application which lists all the pilots who recently violated no drone zone perimeter.

# Technologies

I used React + vite for the frontend and node + express for the backend. I used node-cache to save the pilot data as I didn't seem necessary to use external database. Axios was used for the http requests.

# How to run

1. Clone the repository
2. `cd backend` to go to the backend directory
3. `npm i` to install dependencies
4. `npm run dev` to start nodemon

5. `cd frontend` to go to the backend directory
6. `npm i` to install dependencies
7. `npm run dev` to start vite dev server

# Screenshot

Here you can see my creation. On the right you can see a radar on where the drones were when they violated the NDZ perimeter as red dots. Gray dots are drones that not in the NDZ.

On the left you can see the list of pilots and their information.
![Drone watcher](screenshots/Screenshot_1.png)