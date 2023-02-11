

// Enums
const noneEnum = 1;

// For value
const lowEnum = 2;
const middleEnum = 3;
const highEnum = 4;
const ultraEnum = 5;
const PonyTownEnum = 0;

// Type of filter for game
const blurE = 2
const brightness = 3;
const contrast = 4;
const grayscale = 5;
const hueRotate = 6;
const invert = 7;
const sepia = 8;

function ReturnBorderRound(Enum)
{
    switch(Enum)
    {
        case noneEnum:
            return "MPPL-M-S-BorderRadius-none";
        case lowEnum:
            return "MPPL-M-S-BorderRadius-low";
        case middleEnum:
            return "MPPL-M-S-BorderRadius-middle";
        case highEnum:
            return "MPPL-M-S-BorderRadius-high";
        case ultraEnum:
            return "MPPL-M-S-BorderRadius-ultra";
        case PonyTownEnum:
            return "";
    }
}
function ReturnBackgroundBlur(Enum)
{
    switch(Enum)
    {
        case noneEnum:
            return "MPPL-M-S-BackgroundBlur-none";
        case lowEnum:
            return "MPPL-M-S-BackgroundBlur-low";
        case middleEnum:
            return "MPPL-M-S-BackgroundBlur-medium";
        case highEnum:
            return "MPPL-M-S-BackgroundBlur-high";
    }
}

function ReturnOpacityWindow(Enum)
{
    switch(Enum)
    {
        case noneEnum:
            return "MPPL-M-S-opacityWindow-none";
        case lowEnum:
            return "MPPL-M-S-opacityWindow-low";
        case middleEnum:
            return "MPPL-M-S-opacityWindow-medium";
        case highEnum:
            return "MPPL-M-S-opacityWindow-high";
        case ultraEnum:
            return "MPPL-M-S-opacityWindow-ultra";
        case PonyTownEnum:
            return "";
    }
}
function ReturnExFilterGame(Enum)
{
    switch(Enum)
    {
        case noneEnum:
            return "MPPL-M-S-filterGame-none";
        case lowEnum:
            return "MPPL-M-S-filterGame-low";
        case middleEnum:
            return "MPPL-M-S-filterGame-medium";
        case highEnum:
            return "MPPL-M-S-filterGame-high";
        case ultraEnum:
            return "MPPL-M-S-filterGame-ultra";
    }
}
function ReturnFilterGame(Enum)
{
    switch(Enum)
    {
        case blurE:
            return "MPPL-S-filterGame-blur";
        case brightness:
            return "MPPL-S-filterGame-brightness";
        case contrast:
            return "MPPL-S-filterGame-contrast";
        case grayscale:
            return "MPPL-S-filterGame-grayscale";
        case hueRotate:
            return "MPPL-S-filterGame-hueRotate";
        case invert:
            return "MPPL-S-filterGame-invert";
        case sepia:
            return "MPPL-S-filterGame-sepia";
        case noneEnum:
            return "MPPL-S-filterGame-none";
    }
}



let friends = new Array();
let favourites = new Array();
let settingsData = new Settings();

let versionPlugin = "1.2.0";
let linkToAuthor = "https://stepan323446.github.io/Pony-UI-Plugin-Update/";

let needToUpdate = false;
let dataUpdate;

function Friend(userEl) {
    this.element = userEl;
    this.nicknamePony = function () {
        return userEl.getElementsByClassName("friends-item-name")[0].textContent.toLowerCase();
    }
    this.name = function () {
        return userEl.getElementsByClassName("text-muted friends-item-account")[0].textContent;
    }

    this.addFavourite = function () {
        this.addVisualFavourite();

        favourites.push(this.name());
        chrome.storage.local.set({ "MPPL-Favourites": favourites }, function () {
            console.log("MPPL Loaded data for favourites (Added)");
        });
    }
    this.removeFavourite = function () {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.remove("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.remove("active")

        for (let i = 0; i < favourites.length; i++) {
            if (favourites[i] == this.name()) {
                favourites.splice(i, 1);
                break;
            }
        }

        chrome.storage.local.set({ "MPPL-Favourites": favourites }, function () {
            console.log("MPPL Loaded data for favourites (Removed)");
        });
    }
    this.addVisualFavourite = function () {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.add("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.add("active");
    }
}
function Settings()
{
    this.darkTheme = false;
    this.squareImage = false;

    this.roundnessWindow = PonyTownEnum;

    this.blurBackground = noneEnum;
    this.blurForDropdown = false;

    this.opacityWindow = PonyTownEnum;
    this.opacityInputs = false;

    this.gameFilter = noneEnum;
    this.exGameFilter = lowEnum;

    this.setData = function()
    {
        chrome.storage.local.set({ "MPPL-settings-data": settingsData }, function () {
            console.log("MPPL Loaded data for settings (Added)");
        });
    }
    this.applySettings = function()
    {
        let body = document.body;
        if(this.darkTheme)
            body.classList.add("MPPL-S-DarkTheme");
        else
            body.classList.remove("MPPL-S-DarkTheme");

        if(this.squareImage)
            body.classList.add("MPPL-S-square-portrait");
        else
            body.classList.remove("MPPL-S-square-portrait");

        if(this.blurForDropdown)
            body.classList.add("MPPL-M-S-BlurForDropdown");
        else
        body.classList.remove("MPPL-M-S-BlurForDropdown");
        
        this.setBorderRadius(this.roundnessWindow, true);
        this.setBlurBackground(this.blurBackground, true);
        this.setOpacityWindow(this.opacityWindow, true);
        this.setGameFilter(this.gameFilter, true);
        this.setExGameFilter(this.exGameFilter, true);


        console.log(settingsData);
        console.log("Settings applied");
    }

    this.setBorderRadius = function(enumValue, start = false)
    {
        if(start)
            this.setSpecialSetting(enumValue, this.roundnessWindow, ReturnBorderRound, start);
        else
            settingsData.roundnessWindow = settingsData.setSpecialSetting(enumValue, settingsData.roundnessWindow, ReturnBorderRound, start);
    }
    this.setBlurBackground = function(enumValue, start = false)
    {
        if(start)
            this.setSpecialSetting(enumValue, this.blurBackground, ReturnBackgroundBlur, start);
        else
            settingsData.blurBackground = settingsData.setSpecialSetting(enumValue, settingsData.blurBackground, ReturnBackgroundBlur, start);
    }
    this.setOpacityWindow = function(enumValue, start = false)
    {
        if(start)
            this.setSpecialSetting(enumValue, this.opacityWindow, ReturnOpacityWindow, start);
        else
            settingsData.opacityWindow = settingsData.setSpecialSetting(enumValue, settingsData.opacityWindow, ReturnOpacityWindow, start);
    }
    this.setGameFilter = function(enumValue, start = false)
    {
        if(start)
            this.setSpecialSetting(enumValue, this.gameFilter, ReturnFilterGame, start);
        else
            settingsData.gameFilter = settingsData.setSpecialSetting(enumValue, settingsData.gameFilter, ReturnFilterGame, start);
    }
    this.setExGameFilter = function(enumValue, start = false)
    {
        if(start)
            this.setSpecialSetting(enumValue, this.exGameFilter, ReturnExFilterGame, start);
        else
            settingsData.exGameFilter = settingsData.setSpecialSetting(enumValue, settingsData.exGameFilter, ReturnExFilterGame, start);
    }
    

    this.setSpecialSetting = function(enumValue, settingValue, ReturnFunc, start)
    {
        enumValue = parseInt(enumValue);
        let roundVal = ReturnFunc(enumValue);
        console.log(settingValue);
        if(start)
        {
            if(roundVal != 0)
                document.body.classList.add(roundVal);
        }
        else
        {
            if(settingValue != 0)
                document.body.classList.remove(ReturnFunc(settingValue));

            if(roundVal != 0)
                document.body.classList.add(roundVal);
            
            return enumValue;
        }
    }
}

try {
    chrome.storage.local.get(["MPPL-Favourites"], function (items) {
        favourites = items["MPPL-Favourites"] ?? new Array();
    });
}
catch
{
    console.log("Not found data");
}
try {
    console.log("Checking....");
    chrome.storage.local.get(["MPPL-settings-data"], function (items) {

        function checkSetting(setting, standartValue)
        {
            if(setting == undefined)
            {
                return standartValue;
            }
            else
            {
                return setting;
            }
        }

        settingsData.darkTheme = checkSetting(items["MPPL-settings-data"].darkTheme, new Settings().darkTheme);
        settingsData.squareImage = checkSetting(items["MPPL-settings-data"].squareImage, new Settings().squareImage);
        settingsData.roundnessWindow = checkSetting(items["MPPL-settings-data"].roundnessWindow, new Settings().roundnessWindow);
        settingsData.blurBackground = checkSetting(items["MPPL-settings-data"].blurBackground, new Settings().blurBackground);
        settingsData.blurForDropdown = checkSetting(items["MPPL-settings-data"].blurForDropdown, new Settings().blurForDropdown);
        settingsData.opacityWindow = checkSetting(items["MPPL-settings-data"].opacityWindow, new Settings().opacityWindow);
        settingsData.opacityInputs = checkSetting(items["MPPL-settings-data"].opacityInputs, new Settings().opacityInputs);

        settingsData.gameFilter = checkSetting(items["MPPL-settings-data"].gameFilter, new Settings().gameFilter);
        settingsData.exGameFilter = checkSetting(items["MPPL-settings-data"].exGameFilter, new Settings().exGameFilter);

        settingsData.applySettings();
    });
}
catch
{
    console.log("Not found data");
    standartSetting();
}

function standartSetting()
{
    settingsData = new Settings();
    settingsData.setData();
    settingsData.applySettings();
}

$(document).ready(function () {   
    


    function FooterAppend(footer)
    {
        $(footer).append('<div class="app-version"><div class="MPPL-footer-text">Plugin Pony Town UI: <b>' + versionPlugin +'</b></div><div class="text-nowrap d-inline d-sm-block">by <a target="_blank" href="'+ linkToAuthor +'">Mariana Ponyriama</a></div></div>');
    }
    function UpdateAppend(target)
    {
        if(needToUpdate)
        {
            $(target).append("<span class='MPPL-update-avaible'>Update!</span>");

            $(".MPPL-update-avaible").click(function()
            {
                CreateUpdateWindow();
            });
        }
    }
    FooterAppend($('footer'));
    

    $(document).on("DOMNodeInserted", function (e) {
        if($(e.target).is("footer"))
        {
            FooterAppend(e.target);
            UpdateAppend($(".MPPL-footer-text"));
        }
        if($(e.target).hasClass("modal"))
        {
            $("settings-modal .nav").append("<button id='MPPL-setting-plugin' class='btn-unstyled nav-link'>Plugin</button>")

            $("#MPPL-setting-plugin").click(function()
            {
                $("body").append('<div class="MPPL-container"><div class="MPPL-Window MPPL-settings"><div class="MPPL-modal-header">Settings for Plugin</div><div class="MPPL-modal-content"></div><div class="MPPL-modal-footer"><div class="MPPL-left"><div class="MPPL-version-setting">Version '+ versionPlugin +' by <a href="'+ linkToAuthor +'" target="_blank">Mariana Ponyriama</a></div></div><div class="MPPL-right"><button type="button" class="btn" id="MPPL-reset-plugin">Reset</button><button type="button" class="btn" id="MPPL-close-plugin">Close</button></div></div></div></div>');

                $("#MPPL-close-plugin").click(function()
                {
                    $(".MPPL-container").remove();
                });
                $("#MPPL-reset-plugin").click(function()
                {
                    alert("Settings was set as default");
                    standartSetting();
                    $(".MPPL-container").remove();
                });

                UpdateAppend($(".MPPL-version-setting"));

                // Тёмная тема
                itemSettingsCheckbox("darkTheme", "Dark mode", function()
                {
                    settingsData.darkTheme = true;
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.darkTheme = false;
                    settingsData.setData();
                    settingsData.applySettings();
                }, settingsData.darkTheme, "Turns on dark mode in the game interface");

                // Закруглённость в портрете
                itemSettingsCheckbox("squarePortrait", "Square portrait", function()
                {
                    settingsData.squareImage = true;
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.squareImage = false;
                    settingsData.setData();
                    settingsData.applySettings();
                }, settingsData.squareImage, "Rounded square character's icons");

                itemSettingsSelect("customRoundnessBorder", "Custom border", settingsData.roundnessWindow, settingsData.setBorderRadius, "A certain type of roundness", new SelectedElement("Pony Town", PonyTownEnum), new SelectedElement("None", noneEnum), new SelectedElement("Small", lowEnum), new SelectedElement("Medium", middleEnum), new SelectedElement("Strong", highEnum), new SelectedElement("Super", ultraEnum));

                
                let blurCheckbox;
                if(settingsData.blurBackground == noneEnum)
                        blurCheckbox = false;
                    else
                        blurCheckbox = true;
                itemSettingsCheckbox("blurbackgroundCheckpoint", "Blur for background", function()
                {
                    
                    settingsData.setBlurBackground(lowEnum)
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.setBlurBackground(noneEnum)
                    settingsData.setData();
                    settingsData.applySettings();
                }, blurCheckbox, "Blur effect on the background of windows");


                // ПОЗДНЕЕ ПОСЛЕ OPACITY DROPDOWN
                /* itemSettingsCheckbox("blurForDropdown", "Dropdown menu options", function()
                {
                    settingsData.blurForDropdown = true;
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.blurForDropdown = false;
                    settingsData.setData();
                    settingsData.applySettings();
                }, settingsData.blurForDropdown, "Blur effect on the background of options menu"); */
                itemSettingsSelect("customBackgroundBlur", "Custom Blur", settingsData.blurBackground, settingsData.setBlurBackground, "Degree of blur effect", new SelectedElement("Low", lowEnum), new SelectedElement("Medium", middleEnum), new SelectedElement("High", highEnum));

                /* linkToOtherItem("blurForDropdown", "blurbackgroundCheckpoint", true); */
                linkToOtherItem("customBackgroundBlur", "blurbackgroundCheckpoint", true);

                let opacityCheckbox;
                if(settingsData.opacityWindow == PonyTownEnum)
                        opacityCheckbox = false;
                    else
                        opacityCheckbox = true;
                itemSettingsCheckbox("opacityWindow", "Custom transparency of windows", function()
                {
                    settingsData.setOpacityWindow(lowEnum)
                    settingsData.setData();
                    settingsData.applySettings();
                },
                function()
                {
                    settingsData.setOpacityWindow(PonyTownEnum)
                    settingsData.setData();
                    settingsData.applySettings();
                }, opacityCheckbox, "Choosing the transparency of windows and dropdown lists");
                itemSettingsSelect("customOpacityWindow", "Custom transparency", settingsData.opacityWindow, settingsData.setOpacityWindow, "Degree of transparency effect", new SelectedElement("Low", lowEnum), new SelectedElement("Medium", middleEnum), new SelectedElement("High", highEnum), new SelectedElement("Full", ultraEnum));

                linkToOtherItem("customOpacityWindow", "opacityWindow", true);


                let checkboxFilterGame;
                if(settingsData.gameFilter == noneEnum)
                    checkboxFilterGame = false;
                else
                    checkboxFilterGame = true;

                itemSettingsCheckbox("usegamefilter", "Game Filters", function()
                {
                    settingsData.setGameFilter(brightness);
                    settingsData.setExGameFilter(lowEnum);
                    settingsData.setData();
                    settingsData.applySettings();
                }, function()
                {
                    settingsData.setGameFilter(noneEnum);
                    settingsData.setExGameFilter(noneEnum);
                    settingsData.setData();
                    settingsData.applySettings();
                }, checkboxFilterGame, "Filters that change the image of the game");
                itemSettingsSelect("selectfilter", "Filter", settingsData.gameFilter, settingsData.setGameFilter, "Filter type", new SelectedElement("Brightness", brightness), new SelectedElement("Blur", blurE), new SelectedElement("Contrast", contrast), new SelectedElement("Grayscale", grayscale), new SelectedElement("Hue", hueRotate), new SelectedElement("Invert", invert), new SelectedElement("Sepia", sepia));
                itemSettingsSelect("selectExFilter", "Filter power", settingsData.exGameFilter, settingsData.setExGameFilter, "The strength of the selected parameter is higher", new SelectedElement("Low", lowEnum), new SelectedElement("Medium", middleEnum), new SelectedElement("High", highEnum), new SelectedElement("Ultra", ultraEnum));

                linkToOtherItem("selectfilter", "usegamefilter", true);
                linkToOtherItem("selectExFilter", "usegamefilter", true);

                
                function linkToOtherItem(idItem, idFromLinkItem, valForIt)
                {
                    let item = document.getElementById(idItem + "-item");
                    let FromLink = document.getElementById(idFromLinkItem);

                    $(item).addClass("MPPL-link-item")
                    if(FromLink.checked != valForIt)
                        $(item).addClass("hide");
                    
                    $(FromLink).click(function(){
                        if(FromLink.checked == valForIt)
                        {
                            $(item).removeClass("hide");
                        }
                        else
                        {
                            $(item).addClass("hide");
                        }
                    });
                }
                function itemSettingsCheckbox(id, label, func, unfunc, settedValue, sublabel = "")
                {
                    $(".MPPL-modal-content").append('<div class="item" id="'+ id + '-item' +'"><div class="left"><div class="top"><label for="'+ id +'">'+ label +'</label></div></div><div class="right"><input type="checkbox" name="" id="'+ id +'"></div></div>');
                    if(sublabel != "")
                    {
                        $(document.getElementById(id + "-item")).children(".left").append('<div class="subtop"><label for="'+ id +'">'+ sublabel +'</label></div>');
                    }
                    if(settedValue)
                    {
                        $(document.getElementById(id)).attr('checked', true);
                    }
                    else
                    {
                        $(document.getElementById(id)).attr('checked', false);
                    }
                    $(document.getElementById(id)).click(function()
                    {
                        if (document.getElementById(id).checked) {
                              func();
                          } else {
                              unfunc();
                          }
                    })
                }
                function itemSettingsSelect(id, label, settedValue, funcWithParametr, sublabel = "", ...Elements)
                {
                    $(".MPPL-modal-content").append('<div class="item" id="'+ id + '-item' +'"><div class="left"><div class="top"><label>'+ label +'</label></div></div><div class="right"><select id="'+ id +'"></select></div></div>');
                    if(sublabel != "")
                    {
                        $(document.getElementById(id + "-item")).children(".left").append('<div class="subtop"><label>'+ sublabel +'</label></div>');
                    }
                    for(let i = 0; i < Elements.length; i++)
                    {
                        if(Elements[i].option == settedValue)
                        {
                            $(document.getElementById(id)).append('<option selected value="'+ Elements[i].option +'">'+ Elements[i].text +'</option>')
                        }
                        else
                        {
                            $(document.getElementById(id)).append('<option value="'+ Elements[i].option +'">'+ Elements[i].text +'</option>')
                        }
                    }
                    $(document.getElementById(id)).on("change", function()
                    {
                        let val = $(document.getElementById(id)).val();
                        funcWithParametr(val);
                        settingsData.setData();
                    });
                }
                function SelectedElement(text, option)
                {
                    this.text = text;
                    this.option = option;
                }
            });
        }

        if ($(e.target).hasClass("friends-dropdown-menu")) {
            friends = new Array();
            searchFavourite = false;

            $(".friends-dropdown-menu").append("<input id='MPPL-searchFriend' class='MPPL form-control' type='text' placeholder='Search'>");

            $("#MPPL-searchFriend").keyup(function (e) {

                let value = $("#MPPL-searchFriend").val().toLowerCase();

                if (value == "") {
                    for (let i = 0; i < friends.length; i++) {
                        $(friends[i].element).removeClass("hide");
                    }
                }
                else {
                    for (let i = 0; i < friends.length; i++) {
                        let char1 = friends[i].nicknamePony().includes(value);
                        let char2 = friends[i].name().toLowerCase().includes(value);

                        if (char1 || char2) {
                            $(friends[i].element).removeClass("hide");
                        }
                        else {
                            $(friends[i].element).addClass("hide");
                        }
                    }
                }
            });

            $(".friends-dropdown-menu").append("<div id='MPPL-favouriteFriends' class='MPPL'><div class='MPPL-all-friends MPPL-friends active'>Все</div><div class='MPPL-favourite MPPL-friends'>Избранное</div></div>");

            $(".MPPL-friends").click(function (e) {
                $(".MPPL-friends").removeClass("active");
                $(e.target).addClass("active");

                $("#MPPL-searchFriend").prop("disabled", true);
            });
            $(".MPPL-all-friends").click(function (e) {
                for (let i = 0; i < friends.length; i++) {
                    $(friends[i].element).removeClass("hide");
                }
                $("#MPPL-searchFriend").removeAttr("disabled");
            });



            $(".MPPL-favourite").click(function (e) {
                frie: for (let i = 0; i < friends.length; i++) {
                    fav: for (let s = 0; s < favourites.length; s++) {
                        if (friends[i].name() == favourites[s]) {
                            $(friends[i].element).removeClass("hide");
                            continue frie;
                        }
                    }
                    $(friends[i].element).addClass("hide");
                }
            });
        }

        if ($(e.target).hasClass("friends-item")) {
            let friend = new Friend(e.target);
            friends.push(friend);

            let UserName = e.target.getElementsByClassName("text-muted friends-item-account")[0];


            $(UserName).on("DOMSubtreeModified", function () {
                for (let i = 0; i < favourites.length; i++) {
                    if (favourites[i] == friend.name()) {
                        friend.addVisualFavourite();
                        break;
                    }
                }
            });

        }

        if ($(e.target).hasClass("friends-item")) {
            $(e.target).on("click", function () {
                friends[0].nicknamePony();
            });
            $(e.target).append("<div class='MPPL-addFav'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");
            $(e.target).append("<div class='MPPL-favouriteStar'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");

            $(e.target).children(".MPPL-addFav").click(function () {
                let name = e.target.getElementsByClassName("text-muted friends-item-account")[0].textContent;
                if ($(e.target).children(".MPPL-addFav").hasClass("active")) {
                    for (let i = 0; i < friends.length; i++) {
                        if (name == friends[i].name()) {
                            friends[i].removeFavourite();
                            break;
                        }
                    }
                }
                else {
                    for (let i = 0; i < friends.length; i++) {
                        if (name == friends[i].name()) {
                            friends[i].addFavourite();
                            break;
                        }
                    }
                }

            });
        }

        if(e.target.nodeName == "HOME")
        {
            let servers = document.createElement("div");
            servers.classList.add("MPPL-servers-list");
            servers.innerHTML = "<div>Custom servers: </div>"
            e.target.style.position = "relative";


            function createNewServer(link, linkImage, nameServer)
            {
                servers.innerHTML += `<a href="${link}" target="_blank"><img src="${linkImage}" alt=""><div>${nameServer}</div></a>`;
            }
            createNewServer("https://ashes.town/", "http://ashes.town/apple-touch-icon.png", "Ashes Town");
            createNewServer("https://ashes.town/", "http://ashes.town/apple-touch-icon.png", "Ashes Town");
            e.target.append(servers);
        }

    });
    
    function CreateUpdateWindow()
    {
        console.log(dataUpdate);
        $("body").prepend('<div class="MPPL-container MPPL-Update-Container"><div class="MPPL-Window"><div class="MPPL-modal-header">New Update '+ dataUpdate["UpdatedVersion"] +' for plugin</div><div class="MPPL-modal-content"><div class="MPPL-Update-Img"><img src="' + dataUpdate["UpdatedImage"] +'" alt=""></div><div class="MPPL-title-update">'+ dataUpdate["UpdatedHead"] +'</div><div class="MPPL-list-of-updates"><ul></ul></div></div><div class="MPPL-modal-footer"><div class="MPPL-left"><button class="btn" id="MPPL-close-update">Close</button></div><div class="MPPL-right"><a href="https://stepan323446.github.io/Pony-UI-Plugin-Update/" target="_blank" class="btn">How to update plugin</a><a href="'+ dataUpdate["UpdatedLink"] +'" download" class="btn MPPL-btn-update">Update!</a></div></div></div></div>');

        $("#MPPL-close-update").click(function()
        {
            $(".MPPL-Update-Container").remove();
        });


        for(let i = 0; i < dataUpdate["UpdatedItems"].length; i++)
        {
            $(".MPPL-list-of-updates ul").append('<li>' + dataUpdate["UpdatedItems"][i]["text_content"] +'</li>');
        }
    }

    $.ajax({
        url: 'https://stepan323446.github.io/Pony-UI-Plugin-Update/update.json',
        type: "GET",
        async: true,
        cache: false,
        success: function(data)
        {
            dataUpdate = data;

            if(versionPlugin != dataUpdate["UpdatedVersion"])
            {
                needToUpdate = true;
                CreateUpdateWindow();
                UpdateAppend($(".MPPL-footer-text"));
            }
        }
   });
    
});