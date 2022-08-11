# Аутентификация/авторизация пользователей, client

Клиентская часть, построение архитектуры приложения Angular, более защищенная аутентификация/авторизация, используется два токена `Access token` и `Refresh token`

Back-end, REST API на Express, здесь [https://github.com/dmitriy-tka4/auth-secure-server](https://github.com/dmitriy-tka4/auth-secure-server)

## Техническое задание

* Angular
* Routing, HTTP client, forms, сервисы, взаимодействие с REST API
* SCSS
* Регистрация, авторизация пользователей, просмотр своего профиля
* Используется два токена `Access token` и `Refresh token`, обновление токенов
* Клиент, в случае получения ответа от сервера о том, что  `Access token` истек, делает запрос на `/auth/refresh` для обновления обоих токенов, далее делает запрос к нужному роуту уже с новым `Access token`
* Обработка ошибок (`ErrorInterceptor`, `ErrorService`)

## TODO

* Добавить валидацию форм

## Feedback

Писать на почту - dmitriy.tka4@gmail.com
