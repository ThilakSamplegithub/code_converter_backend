FROM node:slim
WORKDIR /app
COPY . /app
# Set build arguments and environment variables
ARG OPENAI_API_KEY
ARG PORT
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV PORT=$PORT
RUN npm install
EXPOSE $PORT
CMD node index.js