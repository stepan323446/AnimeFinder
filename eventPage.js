var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ChromeMenu = chrome.contextMenus;
var ContextItem = /** @class */ (function () {
    function ContextItem(id, title, parent) {
        if (parent === void 0) { parent = null; }
        this.id = id;
        this.title = title;
        this.parent = parent;
    }
    ContextItem.prototype.getChromeObj = function () {
        if (this.parent != null)
            return {
                id: this.id,
                title: this.title,
                parentId: this.parent.id,
                contexts: ["selection", "editable"],
                type: "normal"
            };
        else
            return {
                id: this.id,
                title: this.title,
                contexts: ["selection", "editable"],
                type: "normal"
            };
    };
    return ContextItem;
}());
var menuItem = new ContextItem("main_btn", "Find Anime");
var specificSearchItem = new ContextItem("specific_search", "Specific Search", menuItem);
var comboSearchItem = new ContextItem("combo_search", "Combo Search", menuItem);
var AnimeItem = /** @class */ (function (_super) {
    __extends(AnimeItem, _super);
    // 0 - title
    // 1 - website/children
    function AnimeItem() {
        var _a;
        var myarray = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            myarray[_i] = arguments[_i];
        }
        var _this = _super.call(this, myarray[0].replace(" ", "").toLowerCase(), myarray[0], specificSearchItem) || this;
        _this.children = [];
        var obj = myarray[1];
        if (typeof obj === "string") {
            if (myarray[2] === undefined)
                myarray[2] == false;
            if (myarray[2]) {
                var search_item = new AnimeItem(_this.title, obj);
                _this.children.push(search_item);
                search_item.parent = _this;
            }
            else {
                _this.title += " search for %s";
                _this.id += "_search";
                _this.parent = _this;
                _this.website = obj;
            }
        }
        if (obj instanceof (Array)) {
            var array = obj;
            array.forEach(function (elem) {
                elem.title = "".concat(elem.title);
                elem.parent = _this;
                elem.id = "".concat(_this.id, "_").concat(elem.id);
            });
            (_a = _this.children).push.apply(_a, obj);
        }
        return _this;
    }
    return AnimeItem;
}(ContextItem));
var animeItems = [
    new AnimeItem("Anilist", [
        new AnimeItem("Anime", "https://anilist.co/search/anime?search="),
        new AnimeItem("Manga", "https://anilist.co/search/manga?search="),
        new AnimeItem("Character", "https://anilist.co/search/characters?search=")
    ]),
    new AnimeItem("Lib", [
        new AnimeItem("AnimeLib", "https://animelib.me/anime-list?name="),
        new AnimeItem("MangaLib", "https://mangalib.me/manga-list?name="),
        new AnimeItem("RanobeLib", "https://ranobelib.me/manga-list?name=")
    ]),
    new AnimeItem("Shikimori", [
        new AnimeItem("Anime", "https://shikimori.me/animes?search="),
        new AnimeItem("Manga", "https://shikimori.me/mangas?search="),
        new AnimeItem("Ranobe", "https://shikimori.me/ranobe?search=")
    ]),
    new AnimeItem("AnimeGo", "https://animego.org/search/all?q=", true),
    new AnimeItem("MyAnimeList", "https://myanimelist.net/search/all?q=", true)
];
var combineId = 0;
var CombineItem = /** @class */ (function (_super) {
    __extends(CombineItem, _super);
    function CombineItem(title) {
        var animeItems = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            animeItems[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, "combine_item_" + combineId.toString(), title, comboSearchItem) || this;
        combineId++;
        _this.animeItems = animeItems;
        return _this;
    }
    CombineItem.getFromArray = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var array = animeItems;
        var curId;
        var result;
        if (args.length > 1) {
            var itemName = args[0];
            var childName = args[1];
            if (childName != null) {
                var fulldId = "".concat(itemName.replace(" ", "").toLowerCase(), "_").concat(childName.replace(" ", "").toLowerCase(), "_search");
                parent: for (var i = 0; i < array.length; i++) {
                    child: for (var j = 0; j < array[i].children.length; j++) {
                        if (array[i].children[j].id != fulldId) {
                            continue child;
                        }
                        else {
                            result = array[i].children[j];
                            break parent;
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].title != itemName)
                        continue;
                    result = array[i].children[0];
                    break;
                }
            }
        }
        else {
            curId = args[0];
            parent: for (var i = 0; i < array.length; i++) {
                child: for (var j = 0; j < array[i].children.length; j++) {
                    if (array[i].children[j].id != curId)
                        continue;
                    else {
                        result = array[i].children[j];
                        break parent;
                    }
                }
            }
        }
        console.log(result);
        return result;
    };
    return CombineItem;
}(ContextItem));
var combineItems = [
    new CombineItem('Anime global search for "%s"', CombineItem.getFromArray("Anilist", "Anime"), CombineItem.getFromArray("Lib", "AnimeLib"), CombineItem.getFromArray("Shikimori", "Anime")),
    new CombineItem('Manga globar search for "%s"', CombineItem.getFromArray("Anilist", "Manga"), CombineItem.getFromArray("Lib", "MangaLib"), CombineItem.getFromArray("MyAnimeList", null))
];
chrome.runtime.onInstalled.addListener(function () {
    ChromeMenu.create(menuItem.getChromeObj());
    ChromeMenu.create(specificSearchItem.getChromeObj(), function () { createTreeSites(animeItems); });
    ChromeMenu.create(comboSearchItem.getChromeObj(), function () { createComboTree(combineItems); });
});
function createTreeSites(contextItems) {
    for (var i = 0; i < contextItems.length; i++) {
        ChromeMenu.create(contextItems[i].getChromeObj());
        if (contextItems[i].children.length > 0) {
            contextItems[i].children.forEach(function (child) {
                ChromeMenu.create(child.getChromeObj());
            });
        }
    }
}
function createComboTree(contextItems) {
    for (var i = 0; i < contextItems.length; i++) {
        ChromeMenu.create(contextItems[i].getChromeObj());
    }
}
ChromeMenu.onClicked.addListener(function (clickData) {
    var selectedText = clickData.selectionText;
    var clickedId = clickData.menuItemId;
    // @ts-ignore
    if (clickedId.includes("combine_item_")) {
        for (var i = 0; i < combineItems.length; i++) {
            if (combineItems[i].id != clickedId)
                continue;
            console.log(combineItems[i]);
            combineItems[i].animeItems.forEach(function (item) {
                var url = item.website + selectedText;
                chrome.tabs.create({ "url": url });
            });
        }
        return;
    }
    var url = CombineItem.getFromArray(clickedId).website + selectedText;
    chrome.tabs.create({ "url": url });
});
