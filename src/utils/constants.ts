export const VALIDATION_ERROR = 400;
export const UNAUTHORIZED_ERROR = 401;
export const FORBIDDEN_ERROR = 403;
export const NOT_FOUND = 404;
export const CONFLICT_ERROR = 409;
export const SERVER_ERROR = 500;
export const REQUEST_OK = 200;
export const CREATED = 201;

export const VALIDATION_ERROR_NAME = 'ValidationError';
export const CAST_ERROR_NAME = 'CastError';

export const SERVER_ERROR_MESSAGE = 'Ошибка по умолчанию';
export const NOT_FOUND_ERROR_CARD_MESSAGE = 'Передан несуществующий _id карточки.';
export const NOT_FOUND_ERROR_USER_MESSAGE = 'Пользователь по указанному _id не найден';

export const urlRegExp = /^((http|https):\/\/)(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\\/+.~#?&//=]*)/;
