# Resume Builder

A browser-based resume editor with a live A4 preview, two resume designs, JSON import/export, and print-to-PDF support.

## Getting Started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Using the Editor

- Edit personal details, profile, experience, skills, education, achievements, interests, and projects. Add or remove as many list entries as needed.
- Choose the Modern or Classic design and display experience grouped by company or by role.
- Resume changes, including data loaded from JSON, are saved automatically in this browser and restored on the next visit. Data is stored locally and is not synced between browsers or devices.
- When no saved resume is available, the editor starts with the fictional software engineer profile in `app/sampleData.json`.
- Choose a profile photo from your device; it is stored separately in IndexedDB. If there is no saved photo, the app shows `public/sample-profile.jpg`. Photos are not included in imported or exported JSON.
- Use **Load JSON** to import another resume file, or select `app/sampleData.json` to restore the example.
- Use **Load sample** to restore the example resume and photo, or **Clear** to empty the resume and remove a custom photo.
- Use **Export** to download the current resume as JSON.
- Use **Print / save as PDF** above the preview to print the resume or save it as a PDF.

Imported files must use the resume data structure below. The field names match `app/data.json`.

| Field | Shape |
| --- | --- |
| `personal` | Object with `name`, `title`, `location`, `email`, `phone`, `linkedin`, and `github` strings |
| `summary` | String |
| `experience` | Array of `{ company, location, positions }`; each position has `job_title`, `start_date`, `end_date`, `duration`, `work_type`, `employment_type`, and a `responsibilities` string array. `duration` may be a string or `null`. |
| `skills` | String array |
| `education` | Array of objects with `degree`, `institution`, `start_date`, `end_date`, and `gpa` strings |
| `hobbies` | String array |
| `achievements` | String array |
| `projects` | Array of objects with `name` and `description` strings |

## Commands

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm start        # Serve the production build (run build first)
```

## Project Structure

- `app/templates/resume-form.tsx` — resume editor and JSON import/export
- `app/templates/template-picker.tsx` — editor state, local persistence, and preview controls
- `app/templates/resume-document.tsx` — shared resume data model and document layout
- `app/templates/modern-resume.tsx` and `app/templates/classic-resume.tsx` — printable designs
- `components/ui/` — shadcn UI components
- `app/sampleData.json` — fictional example resume data used for the first visit and available for import
- `public/sample-profile.jpg` — static profile photo shown when IndexedDB has no selected photo