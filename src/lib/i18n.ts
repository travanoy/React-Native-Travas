import type { Language } from "@/types/language-types";

export const en = {
  "common.loading": "Loading...",
  "common.loadingMore": "Loading more...",
  "common.loadingList": "Loading list...",
  "common.retry": "Retry",
  "common.error": "Error",
  "common.cancel": "Cancel",
  "common.watch": "Watch",
  "common.all": "All",
  "common.seeAll": "All >",
  "common.goBack": "Go back",

  "tabs.home": "Home",
  "tabs.catalog": "Catalog",
  "tabs.saved": "Saved",
  "tabs.profile": "Profile",

  "home.searchPlaceholder": "Search anime...",
  "home.searching": "Searching...",
  "home.noResults": "No results",
  "home.typeToSearch": "Type to search anime",
  "home.loadingBanner": "Loading banner...",

  "catalog.genres": "Genres",
  "catalog.status": "Status",
  "catalog.reset": "Reset",
  "catalog.loading": "Loading catalog...",
  "catalog.empty": "Nothing matches these filters",

  "saved.loading": "Loading saved...",
  "saved.empty": "Nothing in this list yet",

  "continueWatching.title": "Continue Watching",

  "newEpisodes.title": "New Episodes",

  "notifications.title": "Notifications",
  "notifications.empty": "No new episodes yet",
  "notifications.episode": "Episode {n}",

  "profile.title": "Profile",
  "profile.loading": "Loading profile...",
  "profile.nickname": "Nickname",
  "profile.setNickname": "Set nickname",
  "profile.statistics": "Statistics",
  "profile.anime": "Anime",
  "profile.episodes": "Episodes",
  "profile.days": "Days",
  "profile.watching": "Watching",
  "profile.completed": "Completed",
  "profile.planned": "Planned",
  "profile.onHold": "On hold",
  "profile.dropped": "Dropped",
  "profile.appearance": "Appearance",
  "profile.darkTheme": "Dark theme",
  "profile.lightTheme": "Light theme",
  "profile.language": "Language",
  "profile.changePhoto": "Change photo",
  "profile.chooseSource": "Choose a source",
  "profile.takePhoto": "Take photo",
  "profile.chooseGallery": "Choose from gallery",
  "profile.permissionRequired": "Permission required",
  "profile.cameraPermission": "Allow camera access to take a photo.",
  "profile.galleryPermission": "Allow photo access to pick an image.",
  "profile.couldNotUpload": "Could not upload photo.",
  "profile.nicknameRequired": "Nickname required",
  "profile.enterNickname": "Please enter a nickname.",
  "profile.couldNotSave": "Could not save nickname.",

  "anime.loading": "Loading anime...",
  "anime.notFound": "Anime not found",
  "anime.myList": "My list",
  "anime.synopsis": "Synopsis",
  "anime.episodes": "{n} episodes",
  "anime.watchNow": "Watch now",
  "anime.updateError": "Could not update list.",

  "watch.player": "Player",
  "watch.buffering": "Buffering...",
  "watch.loading": "Loading player...",
  "watch.noSources": "No sources available for this anime",
  "watch.episodes": "Episodes",
  "watch.voiceover": "Voiceover",
  "watch.webFallback": "Player isn't available in the web build",
  "watch.openInBrowser": "Open in browser",

  "auth.welcomeBack": "Welcome back",
  "auth.signInToContinue": "Sign in to continue",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.nickname": "Nickname",
  "auth.signIn": "Sign in",
  "auth.signUp": "Sign up",
  "auth.noAccount": "Don't have an account? Sign up",
  "auth.emailPlaceholder": "name@example.com",
  "auth.passwordPlaceholder": "Your password",
  "auth.nicknamePlaceholder": "Your nickname",
  "auth.passwordDots": "••••••••",
  "auth.createAccount": "Create Account",
  "auth.joinTravas": "join to travas",
  "auth.haveAccount": "Already have an account? Sign in",
  "auth.success": "Success",
  "auth.accountCreated": "Account created",
  "auth.loginFailed": "Could not log in. Please try again.",
  "auth.signupFailed": "Could not create your account. Please try again.",
} as const;

export type TranslationKey = keyof typeof en;

const ru: Record<TranslationKey, string> = {
  "common.loading": "Загрузка...",
  "common.loadingMore": "Загружаем ещё...",
  "common.loadingList": "Загружаем список...",
  "common.retry": "Повторить",
  "common.error": "Ошибка",
  "common.cancel": "Отмена",
  "common.watch": "Смотреть",
  "common.all": "Все",
  "common.seeAll": "Все >",
  "common.goBack": "Назад",

  "tabs.home": "Главная",
  "tabs.catalog": "Каталог",
  "tabs.saved": "Сохранённое",
  "tabs.profile": "Профиль",

  "home.searchPlaceholder": "Поиск аниме...",
  "home.searching": "Ищем...",
  "home.noResults": "Ничего не найдено",
  "home.typeToSearch": "Введите название аниме",
  "home.loadingBanner": "Загружаем баннер...",

  "catalog.genres": "Жанры",
  "catalog.status": "Статус",
  "catalog.reset": "Сбросить",
  "catalog.loading": "Загружаем каталог...",
  "catalog.empty": "Под эти фильтры ничего не подходит",

  "saved.loading": "Загружаем сохранённое...",
  "saved.empty": "В этом списке пока пусто",

  "continueWatching.title": "Продолжить просмотр",

  "newEpisodes.title": "Новые серии",

  "notifications.title": "Уведомления",
  "notifications.empty": "Новых серий пока нет",
  "notifications.episode": "Серия {n}",

  "profile.title": "Профиль",
  "profile.loading": "Загружаем профиль...",
  "profile.nickname": "Никнейм",
  "profile.setNickname": "Указать никнейм",
  "profile.statistics": "Статистика",
  "profile.anime": "Аниме",
  "profile.episodes": "Серии",
  "profile.days": "Дней",
  "profile.watching": "Смотрю",
  "profile.completed": "Просмотрено",
  "profile.planned": "Запланировано",
  "profile.onHold": "Отложено",
  "profile.dropped": "Брошено",
  "profile.appearance": "Оформление",
  "profile.darkTheme": "Тёмная тема",
  "profile.lightTheme": "Светлая тема",
  "profile.language": "Язык",
  "profile.changePhoto": "Сменить фото",
  "profile.chooseSource": "Выберите источник",
  "profile.takePhoto": "Сделать фото",
  "profile.chooseGallery": "Выбрать из галереи",
  "profile.permissionRequired": "Нужно разрешение",
  "profile.cameraPermission": "Разрешите доступ к камере, чтобы сделать фото.",
  "profile.galleryPermission": "Разрешите доступ к фото, чтобы выбрать изображение.",
  "profile.couldNotUpload": "Не удалось загрузить фото.",
  "profile.nicknameRequired": "Нужен никнейм",
  "profile.enterNickname": "Введите никнейм.",
  "profile.couldNotSave": "Не удалось сохранить никнейм.",

  "anime.loading": "Загружаем аниме...",
  "anime.notFound": "Аниме не найдено",
  "anime.myList": "Мой список",
  "anime.synopsis": "Синопсис",
  "anime.episodes": "{n} серий",
  "anime.watchNow": "Смотреть",
  "anime.updateError": "Не удалось обновить список.",

  "watch.player": "Плеер",
  "watch.buffering": "Буферизация...",
  "watch.loading": "Загружаем плеер...",
  "watch.noSources": "Для этого аниме нет доступных источников",
  "watch.episodes": "Серии",
  "watch.voiceover": "Озвучка",
  "watch.webFallback": "Плеер недоступен в веб-версии",
  "watch.openInBrowser": "Открыть в браузере",

  "auth.welcomeBack": "С возвращением",
  "auth.signInToContinue": "Войдите, чтобы продолжить",
  "auth.email": "Email",
  "auth.password": "Пароль",
  "auth.confirmPassword": "Подтвердите пароль",
  "auth.nickname": "Никнейм",
  "auth.signIn": "Войти",
  "auth.signUp": "Регистрация",
  "auth.noAccount": "Нет аккаунта? Зарегистрироваться",
  "auth.emailPlaceholder": "name@example.com",
  "auth.passwordPlaceholder": "Ваш пароль",
  "auth.nicknamePlaceholder": "Ваш никнейм",
  "auth.passwordDots": "••••••••",
  "auth.createAccount": "Создать аккаунт",
  "auth.joinTravas": "присоединяйся к travas",
  "auth.haveAccount": "Уже есть аккаунт? Войти",
  "auth.success": "Готово",
  "auth.accountCreated": "Аккаунт создан",
  "auth.loginFailed": "Не удалось войти. Попробуйте ещё раз.",
  "auth.signupFailed": "Не удалось создать аккаунт. Попробуйте ещё раз.",
};

export const messages: Record<Language, Record<TranslationKey, string>> = {
  en,
  ru,
};

export const translate = (
  language: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string => {
  const template = messages[language][key] ?? en[key];

  if (!params) {
    return template;
  }

  let result = template;

  for (const [name, value] of Object.entries(params)) {
    result = result.replaceAll(`{${name}}`, String(value));
  }

  return result;
};
