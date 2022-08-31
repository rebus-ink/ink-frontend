# Unfinished / Broken Features
## Outline (broken)

The outline is currently implemented but very buggy. It often freezes and there are problems that arise when you have more than one copy of the same note. 

Originally, the ordering of notes into an outline was done in the backend. At that time, the outline was not as buggy but it was very slow (we had to do a new API call after any change to the outline, including adding a note, moving a note, editing a note…). To fix the performance problem, we opted for using optimistic rendering and re-do the ordering of notes in the frontend. That is when bugs became a problem and we never got around to fixing it. Our goal was to have the outline (along with other notes-organizing tools) redone with a new design. 
Where are things?

Where the notes are processed in the frontend to order them into an outline (for optimistic rendering)
https://github.com/rebus-ink/ink-frontend/blob/main/src/stores/outline.js
Where it is done in the backend:
https://github.com/rebus-ink/ink-API/blob/main/utils/outline.js

The Outline frontend components:
https://github.com/rebus-ink/ink-frontend/tree/main/src/components/pages

## PDF Reading Interface (broken)
Known bugs:
Highlighting will sometimes select more/less text than the user intended. 
When seeing highlights in notes elsewhere in the application, there are often a lot of blank space added to the text. 

## Notes Import / Export (unfinished)
The idea is to be able to import notes from a docx document and export selected notes to a docx document. 
This can be done in the New Notes form by using the upload option. It will accept a docx document. In the docx document, it will use “*****” as a divider between the notes. For notes with a highlight and note section, it expects “NOTE:” and “HIGHLIGHT:” to divide the two. Without those terms, it will treat the whole note as a single note without a highlight section. 
Exports will be in the same format.
Using the “skip duplicates” option in the note upload form, it will not create any note that is identical (in its content, etc) to one that already exists. That can be used to sync with a docx document. 
This was done as a demo, not a finished feature yet. There should probably be a way to export all notes in a notebook, for example. We also need to clarify how the import / export.


## Collaboration (not implemented yet)
The collaboration feature was built in the backend but not implemented in the frontend. 
The idea was to allow adding collaborators to a notebook. That would give other users permission to access and possibly modify items that are in that notebook (notes, sources, pages…)

Where are things?
routes: https://github.com/rebus-ink/ink-API/tree/main/routes/collaborator
tests: https://github.com/rebus-ink/ink-API/tree/main/tests/integration/collaboration
database models: https://github.com/rebus-ink/ink-API/blob/main/models/Collaborator.js
utils used to chedk that a user is allowed access as a collaborator: (see ‘checkNotebookCollaborator’). This function is used by various routes.  https://github.com/rebus-ink/ink-API/blob/main/utils/utils.js 



