# Reflections on Immersive 3D UI implementations
Instructions on using the UI's:
To switch between the two UI's in immersive mode, press Y. For the first UI option, you can summon/dismiss the UI by pressing B. The second UI, which is attached to your left controller, is meant to not be dismissed, like in Tilt Brush. To switch between various components of that UI, press B.
Note: you must have one of the rays on your controller on to interact with the menu. However, to draw or erase or pen, you must press A on your right controller so that the ray disappears.

GUI #1
1. The first one I implemented, in which a plane appears on the border of the drawing area depending on which direction you're looking, feels like a very intuitive GUI to use -- nearly everyone has seen a 2D GUI before.
2. It's out of the way of your drawing area, and since its position can change depending on your perspective, it makes for good ease of use. However, from far away it may get harder to use with the ray.
3. It was really nice being able to just slap what I had in a1 onto this flat plane, requiring relatively less tweaks than GUI #2. It's very easy to use since it's basically a 2D computer screen. When summoning the menu, although it attempts to go to the edge where you're looking, sometimes it's still a little out of the way.
4. I'd have the possibility of the GUI going to the corners.

GUI #2
1. This one, where it's attached to your left hand, feels natural in an art setting -- it's basically a painting palette.
2. It's close at hand, and you'll always know where it is. However, it is still a little clunky and obstructive.
3. The tracking of the left hand is smooth, and I like how it's similar to Google's Tilt Brush application. However, the small text of the status bar may get hard to read, lots of unused space for the menu items like File, Edit, and View.
4. I'd make it a little smaller and more like Tilt Brush, in which all the menu panels are on a triangular prism and I can rotate the prism to see other panels.