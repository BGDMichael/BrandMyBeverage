const ccThemeRole = Shopify.theme.role ?? 'unknown';
if (!localStorage.getItem('cc-settings-loaded') || localStorage.getItem('cc-settings-loaded') !== ccThemeRole) {
  fetch('https://check.cleancanvas.co.uk/', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    mode: 'cors',
    body: new URLSearchParams({
      shop: Shopify.shop,
      theme: theme.info?.name ?? '',
      version: theme.info?.version ?? '',
      role: ccThemeRole,
      contact: document.querySelector('script[src*=theme-editor][data-contact]')?.dataset.contact
    })
  })
    .then((response) => {
      if (response.ok) {
        localStorage.setItem('cc-settings-loaded', ccThemeRole);
      }
    });
}

document.addEventListener('shopify:section:load', (evt) => {
  // Load and evaluate section specific scripts immediately.
  evt.target.querySelectorAll('script[src]').forEach((script) => {
    const s = document.createElement('script');
    s.src = script.src;
    document.body.appendChild(s);
  });

  // If loaded section is a pop-up, open it.
  if (evt.target.matches('.cc-pop-up')) {
    customElements.whenDefined('pop-up').then(() => {
      evt.target.querySelector('pop-up').open();
    });
  }
});

document.addEventListener('shopify:block:select', (evt) => {
  // If selected block is a slideshow slide, show it and pause autoplay (if enabled).
  if (evt.target.matches('.slideshow__slide')) {
    const slideshow = evt.target.closest('slide-show');

    setTimeout(() => {
      slideshow.setActiveSlide(Number(evt.target.dataset.index));
      slideshow.pauseAutoplay();
    }, 200);
  }

  // If selected block is a slider item, scroll to it.
  if (evt.target.matches('.slider__item')) {
    const carousel = evt.target.closest('carousel-slider');
    if (!carousel.slider) return;

    carousel.slider.scrollTo({
      left: carousel.slides[Array.from(carousel.slides).indexOf(evt.target)].offsetLeft,
      behavior: 'smooth'
    });
  }
});

document.addEventListener('shopify:block:deselect', (evt) => {
  // If deselected block is a slideshow slide, resume autoplay (if enabled).
  if (evt.target.matches('.slideshow__slide')) {
    const slideshow = evt.target.closest('slide-show');

    setTimeout(() => {
      slideshow.resumeAutoplay();
    }, 200);
  }
});

// Debug out custom events
const customEvents = [
  'on:cart:add',
  'on:variant:change',
  'on:line-item:change',
  'on:cart:error',
  'on:cart-drawer:before-open',
  'on:cart-drawer:after-open',
  'on:cart-drawer:after-close',
  'on:quickbuy:before-open',
  'on:quickbuy:after-open',
  'on:quickbuy:after-close',
  'dispatch:cart-drawer:open',
  'dispatch:cart-drawer:refresh',
  'dispatch:cart-drawer:close'
];
customEvents.forEach((event) => {
  document.addEventListener(event, (evt) => {
    if (event.includes('dispatch:cart-drawer') && theme.settings.cartType !== 'drawer') {
      // eslint-disable-next-line
      console.warn(
        'Enterprise Theme: The Cart Drawer is not enabled. To enable it, change Theme Settings > Cart > Cart type.'
      );
    } else {
      // eslint-disable-next-line
      console.info(
        '%cTheme event triggered',
        'background: #000; color: #bada55',
        event,
        evt.detail
      );
    }
  });
});










// document.addEventListener("DOMContentLoaded", function() {

//   // Wait for SA Request a Quote form to load dynamically
//   const waitForForm = setInterval(() => {
//     const formReady =
//       document.querySelector('input[name="How Many Colors"]') &&
//       document.querySelector('input[name="Special Instructions"]');

//     if (formReady) {
//       clearInterval(waitForForm);
//       setTimeout(() => autofillForm(), 500); // short delay for full init
//     }
//   }, 300);

//   function autofillForm() {
//     const getStored = key => sessionStorage.getItem(key) || '';

//     // --- 1️⃣ Number of Colors (radio buttons) ---
//     const numColors = getStored('number_of_colors');
//     if (numColors) {
//       const radios = document.querySelectorAll('input[name="How Many Colors"]');
//       const match = Array.from(radios).find(r => r.value.toLowerCase() === numColors.toLowerCase());
//       if (match) {
//         match.setAttribute('checked', 'checked');
//       }
//     }

//     // --- 2️⃣ Color Names (text fields) ---
//     const colorNames = getStored('color_names');
//     if (colorNames && numColors && !numColors.toLowerCase().includes('more than 4')) {
//       const colors = colorNames.split(',').map(c => c.trim());
//       colors.forEach((color, i) => {
//         const input = document.querySelector(`input[name="Color ${i + 1}"]`);
//         if (input) {
//           input.removeAttribute('disabled');
//           input.value = color;
//         }
//       });
//     }

//     // --- 3️⃣ Imprint Locations (checkboxes) ---
//     const imprint = getStored('imprint_location');
//     if (imprint) {
//       imprint.split(',').forEach(loc => {
//         const checkbox = Array.from(document.querySelectorAll('input[name="Print Location"]'))
//           .find(cb => cb.value.toLowerCase() === loc.trim().toLowerCase());
//         if (checkbox) {
//           checkbox.setAttribute('checked', 'checked');
//         }
//       });
//     }

//     // --- 4️⃣ Artwork Files (Front / Back) ---
//     const artwork = getStored('artwork');
//     if (artwork) {
//       const urls = artwork.split(',').map(u => u.trim());
//       urls.forEach((url, i) => {
//         const input = document.querySelector(`#file-${i + 1}`);
//         if (input) {
//           const img = document.createElement('img');
//           img.src = url;
//           img.width = 80;
//           img.style.marginLeft = '8px';
//           input.insertAdjacentElement('afterend', img);
//           input.removeAttribute('disabled');
//         }
//       });
//     }

//     // --- 5️⃣ Special Instructions ---
//     const special = getStored('special_instructions');
//     if (special) {
//       const input = document.querySelector('input[name="Special Instructions"]');
//       if (input) input.value = special;
//     }

//     // --- 6️⃣ Due Date ---
//     const due = getStored('due_date');
//     if (due) {
//       const dateInput = document.querySelector('input[name="1-4 Color Due Date"]');
//       if (dateInput) dateInput.value = due;
//     }

//     console.log("✅ SA Request a Quote form autofilled from sessionStorage.");
//     sessionStorage.clear();
//   }

// });