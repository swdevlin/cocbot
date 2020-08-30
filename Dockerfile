FROM node:12
WORKDIR bot
COPY package.json package.json
RUN npm install
COPY bot.js .
COPY skills.yaml .
CMD ["node", "bot.js"]
