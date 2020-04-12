FROM node:dubnium-alpine

WORKDIR /app

COPY . /app

RUN npm install

RUN chmod +x start.sh

CMD [ "./start.sh" ]

EXPOSE 5000