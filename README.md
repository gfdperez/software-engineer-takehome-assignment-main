# Dev (Applicant) Notes

Hi there! 

Just a heads up, I wasn't able to finish the core features because I only had two available days to do it. Although, I was able to build the "Product Management" feature at least, and I'll talk more about it below.

## Product Management Feature Notes

**Completed Subfeatures**
* I just used a simple design layout due to time constraints, but I still made it appealing to the user and responsive to screen widths
* I also just used the provided ProductsPage from this repo, so I wouldn't complicate things anymore.
* I was able to implement all the said features mentioned in the README docs. Which are the following:
  - **List View:**
    - Responsive data table with pagination
    - Search functionality (by product name, SKU)
    - Sort columns (name, SKU, created date)
    - Quick actions (edit, delete, view details)
    - Loading states and skeleton screens
    - Empty states when no products exist
  - **Create/Edit Form:**
    - Product name (required)
    - SKU (required, unique)
    - Description (optional, textarea)
    - Base price (required, number validation)
    - Barcode (optional)
    - Form validation with clear error messages
    - Success/error notifications
    - Optimistic updates for better UX
  - **Detail View:**
    - Display all product information
    - Stock levels across all locations (table view)
    - Edit and delete actions

**Things That I Would Do If There's More Time**
* I would add a confirmation modal to the add and edit actions. I wasn't able to do that because it was consuming a lot of my time so I had to move forward with the other features instead.
* I would improve the pagination functionality of my table by including page number and transferring the action buttons (prev, next, row no.) to the GenericTable component. This also includes the disabling the prev and next button if there are no more pages available.
* I would refactor the major components that I made into smaller ones (if possible) for better readability and maintainability
* I would improve the styling of the feature and would not use the generic styling given by the libraries that much.

## Other Notes
**Things That I Would Do If There's More Time**
* I designed some of the existing components for easy reusability, because I was planning to use them in the next core features such as the Inventory Location Management, so if I had more time, it would made the process faster for me to build the next features if ever.
* I would redesign the whole project so it would look more professional and appealing.
* A big chunk of my time was consumed by learning the tech stack that was new to me such as trpc, zod, mui, and tailwind. I was already getting a hang of it, so if there would be more time it would make my progress and workflow faster.
* I am not sure about this, but I may have relied on AI too much because I wanted to speed things up while still verifying the data before implementing it. It's just that if I would be given more time as well, I would find more balance between using AI and writing my own code while doing this project.


