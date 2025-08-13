Button:
    Large:
        Core:
            Radii → borderRadius
            Left and right paddings → Components/button/button-padding-horizontal
            Top and bottom paddings → Components/button/button-padding-vertical
        Contained:            
            Enabled:
                Fill → Base/primary/main
                Label → Base/primary/contrast-text
            Hovered:
                Fill → Base/primary/dark
                Label → Base/primary/contrast-text                
            Disabled:
                Fill → Base/action/disabledBackground
                Label → Base/action/disabled                
        Outlined:
            Enabled:
                Stroke → Base/primary_states/outlinedBorder
                Label → Base/primary/main
            Hovered:
                Fill: Base/primary/_states/hover
                Stroke → Base/primary_states/outlinedBorder
                Label → Base/primary/contrast-text
            Disabled:
                Stroke → Base/action/disabledBackground
                Label → Base/action/disabled
        Text:
            Enabled:
                Label → Base/primary/main
            Hovered:
                Fill: Base/primary/_states/hover
                Label → Base/primary/contrast-text
            Disabled:
                Label → Base/action/disabled