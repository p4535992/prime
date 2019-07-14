/*
 *  Obsidian Portal offline campaign script
 *  Copyright (c) 2010 Kyle Schouviller
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

function fastReplace(str, search, replacement)
{
    // Not as fancy as a regex, but much faster on ie
    var id = str.indexOf(search);
    if (id == -1)
    {
        return str;
    }
    else
    {
        var end = fastReplace(str.substring(id + search.length), search, replacement);
        return str.substring(0, id) + replacement + end;
    }
}

function transformHtml(element)
{
    var str = element.innerHTML;

    str = fastReplace(str, '&gt;', '>');
    str = fastReplace(str, '&lt;', '<');
    str = fastReplace(str, '&amp;', '&');
    
    element.innerHTML = str;
}

function transformHtmlElement(element)
{
    // Need to replace escaped characters
    var htmlstring = element.innerHTML;

    var re = /&gt;/g;
    htmlstring = htmlstring.replace(re, '>');

    var re = /&lt;/g;
    htmlstring = htmlstring.replace(re, '<');
    
    var re = /&amp;/g;
    htmlstring = htmlstring.replace(re, '&');

    element.innerHTML = htmlstring;
}


function transformTextileElement(element)
{
    var textilestring = element.innerHTML;
    if (textilestring.length != 0)
    {
        outstr = superTextile(textilestring);
        element.innerHTML = outstr;
    }
}

function transformDateElement(element)
{
    var datestring = element.innerHTML;
    var date = new Date(datestring);

    element.innerHTML = date.toLocaleString();
}

function transformLinkName(fullname)
{
    if (fullname.length != 0)
    {
        return fullname.substring(fullname.lastIndexOf('/') + 1).toLowerCase();
    }
}

// Performs initial formatting to create anchors, format dates, etc.
function formatDocument()
{
    var elements = document.getElementsByTagName("div");
 
    var element;
    for (var i = 0; i < elements.length; i++)
    {
        var element = elements[i];
        if (
				element.className == "character" ||
				element.className == "item" ||
				element.className == "forumtopic" ||
	            element.className == "wikipage" ||
	            element.className == "blogentry"
			)
        {
            element.id = transformLinkName(element.id);
        }
    }
    
    elements = document.getElementsByTagName("span");
    for (var i = 0; i < elements.length; i++)
    {
        element = elements[i];
        if (element.className == "publishdate")
        {
            transformDateElement(element);
        }
    }
    
    elements = document.getElementsByTagName("a");
    for (var i = 0; i < elements.length; i++)
    {
        element = elements[i];
        if (element.className == "linkanchor")
        {
            element.name = transformLinkName(element.name);
        }
        else if (element.className == "innerlink")
        {
            var linkloc = transformLinkName(element.href);
            element.href = '#' + linkloc;
            element.onclick = new Function("showPage('" + linkloc + "')");
        }
    }
}

var currentPage;
var parseNotifier = '!!!parseme!!!';

var tabpages = new Array('home-page', 'blog', 'main-page', 'characterlist', 'itemlist', 'forum');
var headertabs = new Array('hometab', 'blogtab', 'wikitab', 'characterstab', 'itemstab', 'forumtab');

// Show a page
function showPage(pagename)
{
    var newPage = document.getElementById(pagename);
    if (newPage)
    {
        if (currentPage)
        {
            currentPage.style.display = 'none';
        }
        
        // Parse pages that haven't been parsed yet
        var childnodes = newPage.getElementsByTagName('div');
        for (var i = 0; i < childnodes.length; i++)
        {
            window.status = 'formatting item ' + i + ' of ' + childnodes.length;

            var child = childnodes[i];
            if (child.className == "content")
            {
                if (child.innerHTML.substring(0, parseNotifier.length) == parseNotifier)
                {
                    // Transform the html
                    child.innerHTML = child.innerHTML.substring(parseNotifier.length);
                    transformHtml(child);
                    
                    // Transform all the links in the content section
                    var links = child.getElementsByTagName("a");
                    for (var l = 0; l < links.length; l++)
                    {
                        var link = links[l];

                        var linkloc = transformLinkName(link.href);
                        link.href = '#' + linkloc;
                        link.onclick = new Function("showPage('" + linkloc + "')");
                    }
                }
            }
            
            window.status = '';
        }
        
        currentPage = newPage;
        newPage.style.display = 'block';

        // Check header links
        for (var t = 0; t < headertabs.length; t++)
        {
            if (pagename == tabpages[t])
            {
                document.getElementById(headertabs[t]).className = 'active';
            }
            else
            {
                document.getElementById(headertabs[t]).className = '';
            }
        }
    }
}

// Have to do this as there's no event to catch for back
var t;
function checkForBackPressed()
{
    if (!currentPage)
    {
        return true;
    }

    var hashindex = window.location.href.lastIndexOf('#');
    if (hashindex > 0)
    {
        var location = window.location.href.substring(hashindex + 1);
        if (location != currentPage.id)
        {
            showPage(location);
        }
    }
    else
    {
        showPage('home-page');
    }
}

function initializeCampaign()
{
    // Perform transformations on the document
    formatDocument();
    
    // Hide all pages
    var elements = document.getElementsByTagName('div');
    for (var i = 0; i < elements.length; i++)
    {
        var element = elements[i];
        if (
			element.className == 'character' ||
			element.className == 'item' ||
			element.className == 'forum' ||
            //element.className == 'blogentry' ||
            element.className == 'wikipage' ||
            element.id == 'blog' ||
            element.id == 'characterlist' ||
            element.id == 'itemlist' ||
            element.id == 'forum' ||
            element.id == 'home-page'
            //element.id == 'characters' ||
            //element.id == 'wiki'
            )
        {
            element.style.display = 'none';
        }
    }
    // Check if there is a selected page
    var hashindex = window.location.href.lastIndexOf('#');
    if (hashindex > 0)
    {
        var location = window.location.href.substring(hashindex + 1);
        showPage(location);
    }
    else
    {
        // Select the home page
        showPage('home-page');
    }
    
    // Set up the back check
    t = setInterval('checkForBackPressed()', 200);
}
