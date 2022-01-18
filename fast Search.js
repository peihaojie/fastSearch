// ==UserScript==
// @name          fast search
// @namespace     https://github.com/peihaojie/fastSearch
// @description   注意: 该脚实现选中文本快速复制，快速搜索的功能
// @description   注意: 需要增加适配网站，请手动修改 @include
// @include      *
// @version       1.1.4
// @icon          https://raw.githubusercontent.com/peihaojie/Greasemonkey-script/master/icon.png
// ==/UserScript==

class InitSearch {
  #href =
    "https://at.alicdn.com/t/font_3148281_vf5cr0hy39.css?spm=a313x.7781069.1998910419.83&file=font_3148281_vf5cr0hy39.css";

  #style = `
    *::selection {
      background: #CCCCCC;
      color: #3399CC;
    }

    .search--btn__wrap {
      height: 30px;
      border-radius: 5px;
      background: #fff;
      position: fixed;
      cursor: pointer;
      box-shadow: 0px 0px 5px 2px #9e9e9e;
      overflow: hidden;
      display: flex;
      z-index: 9999;
    }

    .search--btn__wrap .search--btn {
      cursor: pointer;
      width: 30px;
      height: 30px;
      font-size: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .search--btn__wrap .search--btn:hover {
      background-color: #9e9e9e;
    }
  `;
  constructor() {
    this.initStyle();
    this.mouseupListener();
  }

  initStyle() {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = this.#href;
    document.head.appendChild(stylesheet);
    const style = document.createElement("style");
    const styleText = document.createTextNode(this.#style);
    style.appendChild(styleText);
    document.head.appendChild(style);
  }

  mouseupListener() {
    document.body.addEventListener(
      "mouseup",
      (e) => {
        const selection = document.getSelection();
        const selectStr = selection.toString();

        const delBtn = document.getElementById("btn");
        delBtn && document.body.removeChild(delBtn);

        if (selectStr === "") {
          return false;
        }

        const { anchorOffset, focusOffset, isCollapsed } = selection;

        if (isCollapsed) {
          return false;
        }

        const position = this.getPosition(e, anchorOffset, focusOffset);
        const btnWrap = this.createBtnWrap(position, selectStr);
        document.body.appendChild(btnWrap);
      },
      false
    );
  }

  getPosition(e, anchorOffset, focusOffset) {
    let left = e.clientX;
    let top = e.clientY;
    if (anchorOffset > focusOffset) {
      left -= 180;
      top -= 30;
    }
    return { left: `${left}px`, top: `${top}px` };
  }

  createBtnWrap({ left, top }, selectStr) {
    const btn = document.createElement("div");
    btn.classList.add("search--btn__wrap");
    btn.style.left = left;
    btn.style.top = top;
    btn.setAttribute("id", "btn");
    btn.setAttribute("data-text", selectStr);
    this.createBtnList(btn);
    return btn;
  }

  createBtnList(btn) {
    const btnList = [
      {
        url: "https://www.google.com/search?q=",
        title: "google搜索",
        icon: "icon-google",
      },
      {
        url: "https://cn.bing.com/search?q=",
        title: "必应搜索",
        icon: "icon-Bing",
      },
      {
        url: "https://www.baidu.com/s?wd=",
        title: "百度一下",
        icon: "icon-baidu",
      },
      {
        url: "https://www.so.com/s?q=",
        title: "360搜索",
        icon: "icon-icon-test",
      },
      {
        url: "https://www.sogou.com/web?query=",
        title: "搜狗搜索",
        icon: "icon-sougoushuru",
      },
      {
        url: "https://www.zhihu.com/search?q=",
        title: "知乎搜索",
        icon: "icon-shejiaotubiao-10",
      },
      {
        url: false,
        title: "点击复制",
        icon: "icon-fuzhi",
      },
    ];
    btnList.forEach((btnItem) => this.createBtnItem(btn, btnItem));
  }

  createBtnItem(btn, { url, title, icon }) {
    const search = document.createElement("div");
    search.classList.add("search--btn", "iconfont", icon);
    search.setAttribute("title", title);
    search.addEventListener("mouseup", (e) => {
      const text = btn.getAttribute("data-text");
      switch (url) {
        case false:
          this.copyText(text);
          break;
        default:
          window.open(`${url}${text}`);
          break;
      }
      e.stopPropagation();
      document.body.removeChild(btn);
    });
    btn.appendChild(search);
  }

  copyText(text) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
}

window.onload = () => {
  new InitSearch();
};
