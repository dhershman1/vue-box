# Changelog

## v1.3.0

> - Support for `$emit` events added
>   - Currently working on a capture for events
> - Better component support
> - Scoping values locally so they can be picked up by `this`
> - Data is now already in place and ready to be used when the promise resolves
> - You can see data changing with methods or computed values in their scope (see readme for more info)

## v1.2.1

> - Removed an unused dependency
> - Version bump

## v1.2.0

> - Can now support importing of components into your main vue file
> - Added some additions to how files are sanatized
>   - These may need to be made stricter will find out with time
> - Recusively tries to find your vue components and bring them into the main js file

## v1.1.0

> - Complete redo of the main app
> - Stripped using eval (yay!)
> - MUCH more reliable, no picky setups or sanatizers
> - Returns a Promise now, and your tests should run inside the then
> - Keeps your Vue Object fully intact, use it just like vue does
> - Uses rollup to keep things simple (this replaced the eval)
> - Lots of code optimizations
> - Multi level components not currently supported. Still working this out.

## v1.0.1
> - Stabilized how the ending bracket could break the process, depending on if you used a semi colon or not
> - Added in tests now so you can see the module in action and see how it runs in your test files
> - Added `setThis` method to allow the user to set the this scope later if they want to call their data method
> - Some more stabilization fixes
