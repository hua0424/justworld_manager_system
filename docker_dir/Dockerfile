FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf

ADD ./nginx /etc/nginx/conf.d/

#RUN rm /etc/nginx/nginx.conf
#COPY . /usr/share/nginx/html/
#COPY mysite.template /etc/nginx
COPY ./ /usr/share/nginx/html/
CMD  nginx -g 'daemon off;'
