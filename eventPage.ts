import ChromeMenu = chrome.contextMenus;

class ContextItem {
    id: string;
    title: string;
    parent: ContextItem|null;

    constructor(id: string, title: string, parent: ContextItem|null = null){
        this.id = id;
        this.title = title
        this.parent = parent;
    }
    public getChromeObj():ChromeMenu.CreateProperties{
        if(this.parent != null)
            return {
                id: this.id,
                title: this.title,
                parentId: this.parent.id,
                contexts: ["selection", "editable"],
                type: "normal"
            }
        else
            return {
                id: this.id,
                title: this.title,
                contexts: ["selection", "editable"],
                type: "normal"
            }
    }
}
let menuItem = new ContextItem("main_btn", "Find Anime");
let specificSearchItem = new ContextItem("specific_search", "Specific Search", menuItem)
let comboSearchItem = new ContextItem("combo_search", "Combo Search", menuItem)


class AnimeItem extends ContextItem {
    children: Array<AnimeItem> = [];
    website: string;

    constructor(title: string, website: string, isMainSingle?: boolean);
    constructor(title: string, children: Array<AnimeItem>);

    // 0 - title
    // 1 - website/children
    constructor(...myarray: any[]){
        super(myarray[0].replace(" ", "").toLowerCase(), myarray[0], specificSearchItem)

        let obj = myarray[1];
        if(typeof obj === "string"){
            if(myarray[2] === undefined)
                myarray[2] == false;
            
            if(myarray[2]){
                let search_item = new AnimeItem(this.title, obj);
                this.children.push(search_item);
                search_item.parent = this;
            } else {
                this.title += " search for %s";
                this.id += "_search";
                this.parent = this;
                this.website = obj;
            }
        } 
        if(obj instanceof Array<AnimeItem>) {
            let array = obj as Array<AnimeItem>;
            
            array.forEach(elem => {
                elem.title = `${elem.title}`;
                elem.parent = this;
                elem.id = `${this.id}_${elem.id}`
            });
            this.children.push(...obj);
        }
    }
    
}

let animeItems: Array<AnimeItem> = [
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

let combineId: number = 0;
class CombineItem extends ContextItem {
    animeItems: Array<AnimeItem>;
    constructor(title: string, ...animeItems: AnimeItem[]){
        super("combine_item_" + combineId.toString(), title, comboSearchItem);
        combineId++;
        this.animeItems = animeItems;
    }

    static getFromArray(id: string):AnimeItem;
    static getFromArray(itemName: string, childName: string|null):AnimeItem;

    static getFromArray(...args: any[]):AnimeItem {
        let array: Array<AnimeItem> = animeItems;
        let curId: string;
        let result: AnimeItem;

        if(args.length > 1){
            let itemName: string = args[0];
            let childName: string|null = args[1];
            
            if(childName != null){
                let fulldId = `${itemName.replace(" ", "").toLowerCase()}_${childName.replace(" ", "").toLowerCase()}_search`
                
                parent: for(let i = 0; i < array.length; i++){           
                    child: for(let j = 0; j < array[i].children.length; j++){
                        if(array[i].children[j].id != fulldId){
                            continue child;
                        }
                        else{
                            result = array[i].children[j]
                            break parent;
                        }
                    }
                }
            } else {
                for(let i = 0; i < array.length; i++){
                    if(array[i].title != itemName)
                        continue;

                    result = array[i].children[0];
                    break;
                }
            }
        } else {
            curId = args[0]
            parent: for(let i = 0; i < array.length; i++){
                child: for(let j = 0; j < array[i].children.length; j++){
                    if(array[i].children[j].id != curId)
                        continue;
                    else{
                        result = array[i].children[j]
                        break parent;
                    }
                }
            }
        }
        console.log(result);
        return result;
    }
}

let combineItems: Array<CombineItem> = [
    new CombineItem('Anime global search for "%s"', CombineItem.getFromArray("Anilist", "Anime"), CombineItem.getFromArray("Lib", "AnimeLib"), CombineItem.getFromArray("Shikimori", "Anime")),
    new CombineItem('Manga globar search for "%s"', CombineItem.getFromArray("Anilist", "Manga"), CombineItem.getFromArray("Lib", "MangaLib"), CombineItem.getFromArray("MyAnimeList", null))
]

chrome.runtime.onInstalled.addListener(() => {
    ChromeMenu.create(menuItem.getChromeObj());
    ChromeMenu.create(specificSearchItem.getChromeObj(), function () { createTreeSites(animeItems) });
    ChromeMenu.create(comboSearchItem.getChromeObj(), function () { createComboTree(combineItems) });
})

function createTreeSites(contextItems: Array<AnimeItem>){
    for(let i = 0; i < contextItems.length; i++){
        ChromeMenu.create(contextItems[i].getChromeObj())
            if(contextItems[i].children.length > 0){
                contextItems[i].children.forEach(child => {
                    ChromeMenu.create(child.getChromeObj());
                });
            } 
    }
}
function createComboTree(contextItems: Array<CombineItem>){
    for(let i = 0; i < contextItems.length; i++){
        ChromeMenu.create(contextItems[i].getChromeObj())
    }
}

ChromeMenu.onClicked.addListener(function(clickData){
    let selectedText = clickData.selectionText;
    let clickedId = clickData.menuItemId as string;

    // @ts-ignore
    if(clickedId.includes("combine_item_")){
        for(let i = 0; i < combineItems.length; i++){
            if(combineItems[i].id != clickedId)
                continue;
            
            console.log(combineItems[i]);
            combineItems[i].animeItems.forEach(item => {
                let url: string = item.website + selectedText;
                chrome.tabs.create({"url": url})
            });   
        }
        return;
    }

    let url: string = CombineItem.getFromArray(clickedId).website + selectedText;
    chrome.tabs.create({"url": url})
})