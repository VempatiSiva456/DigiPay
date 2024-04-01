FROM node:20.11.1

# Set the working directory for the server
WORKDIR /usr/src/app/server

# Copy package.json and package-lock.json (if available) for the server
COPY server/package*.json ./

# Install server dependencies
RUN npm install
RUN npm install cors

# Copy the server source code into the container
COPY server/ ./

# Set the working directory back to /usr/src/app for client files
WORKDIR /usr/src/app

# Copy the built client application to the container
COPY client/dist ./client/dist

# Environment variables
ENV DB_CONNECTION_STRING=mongodb+srv://vempatisiva7:Rgukt%40N190604@digipay.rflrxlp.mongodb.net/?retryWrites=true&w=majority&appName=digipay
ENV JWT_SECRET="Rgukt@N190604"
ENV PORT=5000

# Expose the port the server listens on
EXPOSE 5001

# Set the working directory again to server to start the server
WORKDIR /usr/src/app/server

# Command to run the server
CMD ["npm", "start"]
