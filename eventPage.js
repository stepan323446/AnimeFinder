var animeSitesList = [
    {
        id: "animego",
        title: "AnimeGo",
        hasChildren: false,
        website: "https://animego.org/search/all?q="
    },
    {
        id: "lib",
        title: "Lib",
        hasChildren: true,
        children:
            [
                {
                    id: "anime",
                    title: "AnimeLib",
                    website: "https://animelib.me/anime-list?name="
                },
                {
                    id: "manga",
                    title: "MangaLib",
                    website: "https://mangalib.me/manga-list?name="
                },
                {
                    id: "ranobe",
                    title: "RanobeLib",
                    website: "https://ranobelib.me/manga-list?name="
                }
            ]
    },
]

var contextMenuItem = {
    id: "main_btn",
    title: "Find Anime",
    contexts: ["selection", "editable"],
    type: "normal"
};
var idsArray = [];
var idsArrayItems = new Map();
chrome.contextMenus.create(contextMenuItem, function () { createTree(animeSitesList, "main_btn") });

function createTree(originalArrayData, parentId) {
    
    originalArrayData.forEach(item => {
        chrome.contextMenus.create(
            {
                id: item.id,
                parentId: parentId,
                title: item.title,
                contexts: ["selection", "editable"],
                type: "normal"
            }
        )
        if (item.hasChildren) {
            item.children.forEach(child => {
                var currentId = getChildrenId(child.id, item.id);
                chrome.contextMenus.create(
                    {
                        id: currentId,
                        parentId: item.id,
                        title: getTitleSearch(child.title, "%s"),
                        contexts: ["selection", "editable"],
                        type: "normal"
                    }
                );
                idsArray.push(currentId);
                idsArrayItems.set(currentId, child.website);
            });
        }
        else{
            var currentId = `${item.id}_search`;
            chrome.contextMenus.create(
                {
                    id: currentId,
                    parentId: item.id,
                    title: getTitleSearch(item.title, "%s"),
                    contexts: ["selection", "editable"],
                    type: "normal"
                }
            )
            idsArray.push(currentId);
            idsArrayItems.set(currentId, item.website);
        }
    });
}
chrome.contextMenus.onClicked.addListener(function(clickData){
    let selectionText = clickData.selectionText;
    let selectedIdSource = clickData.menuItemId;

    if(idsArray.includes(selectedIdSource) && selectionText){
        let websiteSearch = idsArrayItems.get(selectedIdSource) + selectionText;
        chrome.tabs.create({'url': websiteSearch}, function(tab) {});
    }
});

function getChildrenId(children, parent) {
    return `${parent}_${children}`;
}
function getTitleSearch(title, context){
    return `${title} search for "${context}"`
}