$(function(){
  var initMainSlider = function() {
    var mainSlider =  new Swiper('.main-slider__container', {
      slidesPerView: 1,
      pagination: '.swiper-pagination',
      paginationClickable: true,
      spaceBetween: 0,
      nextButton: '.swiper__button-next',
      prevButton: '.swiper__button-prev',
      speed: 1000,
      slideClass: 'main-slider__slide'
    }); 
  };

  var initClientSlider = function() {
    var clientsSlider =  new Swiper('.clients__slider-container', {
      slidesPerView: 6,
      spaceBetween: 30,
      nextButton: '.swiper__button-next',
      prevButton: '.swiper__button-prev',
      speed: 1000,
      slideClass: 'clients__slide',
      breakpoints: {
        992: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
        768: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 20
        },
        480: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 10
        }
      }
    }); 
  }

  initClientSlider();

  $('.navbar-header').on('show.bs.dropdown', function(ev) {
    var $this = $(this);
    $this.find('.open-menu').addClass('open');
  });

  $('.navbar-header').on('hide.bs.dropdown', function(ev) {
    var $this = $(this);
    $this.find('.open-menu').removeClass('open');
  });

  $('.menu-toggle-btn').on('click',function() {
    var $menu = $(this).find('.open-menu');
    if($(window).width() < 786) {
      $menu.toggleClass('open');
      if ($menu.hasClass('open')) {
        $('.menu-container').show();
      } else {
        $('.menu-container').hide();
      }
    }
  });

  $('[data-progressbar]').each(function() {
    var value = parseFloat($(this).data('progressbar-value'));

    var bar = new ProgressBar.SemiCircle(this, {
      strokeWidth: 15,
      color: '#e2534b',
      trailColor: '#76c7c0',
      trailWidth: 15,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: null,
      text: {
        value: '',
        alignToBottom: false
      },
      from: { color: '#e2534b' },
      to: { color: '#e2534b' },
      // Set default step function for all animate calls
      step: function(state, bar) {
        bar.path.setAttribute('stroke', state.color);
        var value = Math.round(bar.value() * 100);
        if (value === 0) {
          bar.setText('');
        } else {
          bar.setText(value);
        }
        bar.text.style.color = '#7f8c8c';
      }
    });

    bar.text.style.fontWeight = '800';
    bar.text.style.fontSize = '30px';
    bar.text.style.bottom = '12px';

    bar.animate(value);
  });

  $.get("inc/services.json", function(data) {
    var servicesTemplate = $("#services-template").html();
    var compiled = _.template(servicesTemplate);
    $(".services").html(compiled({ services: data }))
  });

  $.get("inc/gallery.json", function(data) {
    var galleryTemplate = $("#gallery-template").html();
    var compiled = _.template(galleryTemplate);
    $(".main-slider").html(compiled({ gallery: data }));
    initMainSlider();
  });
});