let snapSections = gsap.utils.toArray(".snap"),
    snapper;

ScrollTrigger.create({
  trigger: snapSections[0], // first section
  start: "top bottom",
  endTrigger: snapSections[snapSections.length-1], // last section
  end: "bottom top",
  onRefresh: self => {
    // translate the offsetTop of each section into a progress value between the ScrollTrigger's start and end for snapping
    let values = snapSections.map(section => gsap.utils.normalize(self.start, self.end, section.offsetTop));
    values.push(1); // make sure it can snap to the end of the last section.
    snapper = gsap.utils.snap(values); // create a function that'll do the snapping for us. Just pass in a value and it'll return the closest one in the Array.
  },
  snap: value => snapper(value)
});


// Flexbox filtering with gsap.flip()

const allCheckbox = document.querySelector('#all'),
      filters = gsap.utils.toArray('.filter'),
      items = gsap.utils.toArray('.item');

function updateFilters() {
  const state = Flip.getState(items), // get the current state
        classes = filters.filter(checkbox => checkbox.checked).map(checkbox => "." + checkbox.id),
        matches = classes.length ? gsap.utils.toArray(classes.join(",")) : classes;

  // adjust the display property of each item ("none" for filtered ones, "inline-flex" for matching ones)
  items.forEach(item => item.style.display = matches.indexOf(item) === -1 ? "none" : "inline-flex");
 
  // animate from the previous state
	Flip.from(state, {
		duration: 1,
    scale: true,
    absolute: true,
    ease: "power1.inOut",
		onEnter: elements => gsap.fromTo(elements, {opacity: 0, scale: 0}, {opacity: 1, scale: 1, duration: 1}),
		onLeave: elements => gsap.to(elements, {opacity: 0, scale: 0, duration: 1})
	});
  
  // Update the all checkbox:
  allCheckbox.checked = matches.length === items.length; 
}

filters.forEach(btn => btn.addEventListener('click', updateFilters));
allCheckbox.addEventListener('click', () => {
  filters.forEach(checkbox => checkbox.checked = allCheckbox.checked);
  updateFilters();
});
