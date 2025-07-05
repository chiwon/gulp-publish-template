# Gulp Publishing Template

빠르고 유연한 퍼블리싱 개발을 위한 Gulp 템플릿입니다.

## 포함된 기능

- SCSS(Dart Sass) 컴파일 및 CSS beautify
- HTML File Include (`@@include`)
- JS 자동 복사 및 vendor 분리
- 이미지 복사
- LiveReload (`BrowserSync`)
- `.editorconfig` / `.prettierrc` 포함
- vendor CSS 복사 (`src/assets/css/vendors/` → `dist/assets/css/vendors/`)

## 프로젝트 구조

```
src/
├── index.html
├── pages/
│   ├── about.html
│   ├── _header.html
│   └── _footer.html
├── assets/
│   ├── scss/
│   │   ├── app.scss
│   │   └── _reset.scss
│   ├── css/
│   │   └── vendors/
│   │       └── swiper.min.css
│   ├── js/
│   │   ├── main.js
│   │   └── vendors/
│   │       └── swiper.min.js
│   └── img/
```

## 사용법

```bash
npm install
gulp
```

> 최초 실행 시 `dist/` 초기화 후 개발 서버가 실행됩니다.

## 의존성

- gulp
- gulp-sass (dart-sass)
- gulp-file-include
- gulp-beautify
- browser-sync
- gulp-clean
- gulp-newer
- gulp-plumber

## 사용 시 주의

- 벤더 CSS(swiper 등)는 **`src/assets/css/vendors/`** 폴더에 넣어주세요.
- Gulp가 자동으로 `dist/assets/css/vendors/`로 복사합니다.
- 벤더 JS는 `src/assets/js/vendors/`에 넣어주세요.
- 커스텀 JS는 `src/assets/js/`에, SCSS는 `src/assets/scss/`에 작성해주세요.
