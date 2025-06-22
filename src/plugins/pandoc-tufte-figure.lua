-- Handle the fullwidthfigure directive.
function Div(div)
    if div.classes:includes("fullwidth") then
        return div.content
    end
    local isiframefigure = function (class)
        return class:match "^iframefigure.*"
    end
    if div.classes:find_if(isiframefigure) then
        return pandoc.Para({
            pandoc.Span({
                pandoc.Str("Warning:"),
                pandoc.Space(),
                pandoc.Code(":::iframefigure"),
                pandoc.Space(),
                pandoc.Str("is not supported in EPUB"),
            }, {
                class = "warning",
            })
        })
    end
end

-- Handle bracketed .marginfigure and .iframefigure spans.
function Span(span)
    if span.classes:includes("marginfigure") then
        -- From `<span class="marginfigure">xxx</span>`
        -- Into `xxx`
        return span.content
    end
end
