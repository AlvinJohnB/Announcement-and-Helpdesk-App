# PowerShell script to update import paths after refactoring to recommended structure
# Run this from the client/src directory

$files = Get-ChildItem -Path . -Recurse -Include *.js,*.jsx

foreach ($file in $files) {
    (Get-Content $file.PSPath) |
        ForEach-Object {
            $_ -replace 'from "\.\/components\/AnnouncementList"', 'from "./components/announcements/AnnouncementList"' |
            ForEach-Object { $_ -replace 'from "\.\/components\/AnnouncementItem"', 'from "./components/announcements/AnnouncementItem"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/AnnouncementForm"', 'from "./components/announcements/AnnouncementForm"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/HelpdeskTabs"', 'from "./components/helpdesk/HelpdeskTabs"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/HelpdeskTicketList"', 'from "./components/helpdesk/HelpdeskTicketList"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/HelpdeskTicketItem"', 'from "./components/helpdesk/HelpdeskTicketItem"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/HelpdeskTicketForm"', 'from "./components/helpdesk/HelpdeskTicketForm"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/EndorsementTabs"', 'from "./components/endorsements/EndorsementTabs"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/EndorsementList"', 'from "./components/endorsements/EndorsementList"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/EndorsementItem"', 'from "./components/endorsements/EndorsementItem"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/EndorsementForm"', 'from "./components/endorsements/EndorsementForm"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/Header"', 'from "./components/common/Header"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/LoadingSpinner"', 'from "./components/common/LoadingSpinner"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/ConfirmDialog"', 'from "./components/common/ConfirmDialog"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/NotFound"', 'from "./components/common/NotFound"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/BBCodeEditor"', 'from "./components/common/BBCodeEditor"' } |
            ForEach-Object { $_ -replace 'from "\.\/components\/TipTapEditor"', 'from "./components/common/TipTapEditor"' } |
            ForEach-Object { $_ -replace 'import ".\/components\/Announcement.css"', 'import "./assets/styles/Announcement.css"' } |
            ForEach-Object { $_ -replace 'import ".\/components\/TipTapEditor.css"', 'import "./assets/styles/TipTapEditor.css"' }
        } | Set-Content $file.PSPath
}

Write-Host "Import paths updated!"
