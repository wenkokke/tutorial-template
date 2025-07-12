function Div(el)
    -- Handle epigraph directive.
    -- if el.classes:includes("epigraph") then
    --   local blocks = pandoc.Blocks({})
    --   blocks:insert(pandoc.RawBlock('latex', '\\openepigraph{'))
    --   if #el.content == 1 and el.content[1].t == 'BlockQuote' then
    --     blocks:extend(el.content[1].content)
    --   end
    --   blocks:insert(pandoc.RawBlock('latex', '}{'))
    --   blocks:insert(pandoc.RawBlock('latex', '}'))
    --   return blocks
    -- end
    -- Handle fullwidth directive.
    if el.classes:includes("fullwidth") then
      local blocks = pandoc.Blocks({})
      blocks:insert(pandoc.RawBlock('latex', '\\begin{fullwidth}'))
      blocks:extend(el.content)
      blocks:insert(pandoc.RawBlock('latex', '\\end{fullwidth}'))
      return blocks
    end
    -- Handle iframe directive.
end

function Span(el)
    -- Handle newthought span.
    if el.classes:includes("newthought") then
      local inlines = pandoc.Inlines({})
      inlines:insert(pandoc.RawInline('latex', '\\newthought{'))
      inlines:extend(el.content)
      inlines:insert(pandoc.RawInline('latex', '}'))
      return inlines
    end
    -- Handle cite span.
    if el.classes:includes("cite") then
      local inlines = pandoc.Inlines({})
      inlines:insert(pandoc.RawInline('latex', '\\textit{'))
      inlines:extend(el.content)
      inlines:insert(pandoc.RawInline('latex', '}'))
      return inlines
    end
    -- Handle footer span.
    -- Handle margin span.
    if el.classes:includes("margin") then
      local inlines = pandoc.Inlines({})
      if el.attributes.label ~= nil then
        inlines:insert(pandoc.Str(el.attributes.label))
      end
      inlines:insert(pandoc.RawInline('latex', '\\marginnote{'))
      inlines:extend(el.content)
      inlines:insert(pandoc.RawInline('latex', '}'))
      return inlines
    end
end

function Note(el)
  -- Handle side notes.
  -- NOTE: Pandoc cannot distinguish between side and margin notes.
  -- Handle margin notes.
    local inlines = pandoc.Inlines({})
    inlines:insert(pandoc.RawInline('latex', '\\marginnote{'))
    if #el.content == 1 and el.content[1].t == 'Para' then
      inlines:extend(el.content[1].content)
    end
    inlines:insert(pandoc.RawInline('latex', '}'))
    return inlines
end
