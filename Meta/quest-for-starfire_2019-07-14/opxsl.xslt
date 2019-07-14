<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>
  
  <xsl:template match="/campaign">
    <html>
      <head>
        <title>
          <xsl:value-of select="title"/>
        </title>
        <link rel="stylesheet" type="text/css" href="opstyle.css"/>
        <script type="text/javascript" src="opscript.js">
          <!--
          -->
        </script>
      </head>
      <body onload="initializeCampaign();return true;">
        <div id="content">
          <div id="header">
            <span id="campaigntitle">
              <a href="#home-page" onclick="showPage('home-page');">
                <xsl:value-of select="title"/>
              </a>
            </span>
            <div id="headbar">
              <span>
                <a href="http://www.obsidianportal.com">obsidian portal</a>
              </span>
              <ul>
                <li id="hometab">
                  <a href="#home-page" onclick="showPage('home-page');">Home</a>
                </li>
                <li id="blogtab">
                  <a href="#blog" onclick="showPage('blog');">Adventure Log</a>
                </li>
                <li id="wikitab">
                  <a href="#main-page" onclick="showPage('main-page');">Wiki</a>
                </li>
                <li id="characterstab">
                  <a href="#characterlist" onclick="showPage('characterlist');">Characters</a>
                </li>
                <li id="itemstab">
                  <a href="#itemlist" onclick="showPage('itemlist');">Items</a>
                </li>
                <li id="forumtab">
                  <a href="#forum" onclick="showPage('forum');">Forum</a>
                </li>
              </ul>
            </div>
          </div>
          <div id="maincontent">
            <xsl:apply-templates select="blog"/>
            <xsl:apply-templates select="wiki"/>
            <xsl:apply-templates select="characters"/>
            <xsl:apply-templates select="items"/>
            <xsl:apply-templates select="forum"/>
          </div>
          <div id="footer">
            <span>
              code and design by <a href="http://www.kyleschouviller.com">Kyle Schouviller</a>
            </span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="blog">
    <div id="blog">
      <xsl:apply-templates select="entry"/>
    </div>
  </xsl:template>

  <xsl:template match="blog/entry">
    <div class="blogentry" id="{link}">
      <a name="{link}" class="linkanchor"/>
      <h2>
        <xsl:value-of select="title"/>
      </h2>
      <h3 class="publishdate">
        <span class="publishdate">
          <xsl:value-of select="published"/>
        </span>
      </h3>
      <xsl:apply-templates select="content[@format='html']"/>
    </div>
  </xsl:template>

  <xsl:template match="wiki">
    <xsl:apply-templates select="page"/>
  </xsl:template>

  <xsl:template match="wiki/page">
    <div class="wikipage" id="{link}">
      <a name="{link}" class="linkanchor"/>
      <h2>
        <xsl:value-of select="title"/>
      </h2>
      <h3>
        <span class="publishdate">
          <xsl:value-of select="published"/>
        </span>
      </h3>
      <xsl:apply-templates select="content[@format='html']"/>
    </div>
  </xsl:template>


  <xsl:template match="characters">
    <div id="characterlist">
      <div class="characterlisting">
        <xsl:for-each select="character">
          <a href="{link}" class="innerlink">
            <xsl:value-of select="title"/>
          </a>
          <br/>
        </xsl:for-each>
      </div>
    </div>
    <xsl:apply-templates select="character"/>
  </xsl:template>

  <xsl:template match="characters/character">
    <div class="character" id="{link}">
      <a name="{link}" class="linkanchor"/>
      <h2>
        <xsl:value-of select="title"/>
      </h2>
      <xsl:apply-templates select="content[@format='html']"/>
    </div>
  </xsl:template>
  
  
  <xsl:template match="items">
    <div id="itemlist">
      <div class="itemlisting">
        <xsl:for-each select="item">
          <a href="{link}" class="innerlink">
            <xsl:value-of select="title"/>
          </a>
          <br/>
        </xsl:for-each>
      </div>
    </div>
    <xsl:apply-templates select="item"/>
  </xsl:template>

  <xsl:template match="items/item">
    <div class="item" id="{link}">
      <a name="{link}" class="linkanchor"/>
      <h2>
        <xsl:value-of select="title"/>
      </h2>
      <xsl:apply-templates select="content[@format='html']"/>
    </div>
  </xsl:template>


  <xsl:template match="forum">
    <div id="forum">
      <xsl:apply-templates select="topic"/>
    </div>
  </xsl:template>

  <xsl:template match="forum/topic">
    <div class="forumtopic" id="{link}">
      <a name="{link}" class="linkanchor"/>
      <h2>
        <xsl:value-of select="title"/>
      </h2>
      <xsl:for-each select="post">
        <h3>
          Posted by: <xsl:value-of select="author"/>
        </h3>
        <span class="publishdate">
          <xsl:value-of select="published"/>
        </span>
        <xsl:apply-templates select="content[@format='html']"/>
      </xsl:for-each>
    </div>
  </xsl:template>
  
  
  <xsl:template match="content">
    <div class="content">!!!parseme!!!<xsl:value-of select="."/></div>
  </xsl:template>
  
</xsl:stylesheet>
