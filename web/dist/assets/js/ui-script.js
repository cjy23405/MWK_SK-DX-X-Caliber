(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android ([0-9]+\.[0-9]+(\.[0-9]+)*)/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // common
  var $win = $(window);
  var $doc = $(document);

  // swiperSet
  // https://swiperjs.com/swiper-api
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      playControl: false,
      pauseControl: false,
      scrollbarControl: false,
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();

      if (!$this.parent('.swiper-container').length) {
        $this.wrap('<div class="swiper-object"><div class="swiper-container"></div></div>');
      }
      $this.addClass('swiper-wrapper');
      $items.addClass('swiper-slide').each(function (i) {
        $(this).attr('data-swiper-set-slide-index', i);
      });

      var $container = $this.parent('.swiper-container');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.pageControl) {
        $appendController.append('<div class="swiper-pagination"></div>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">next</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">prev</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<div class="swiper-scrollbar"></div>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">play</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">pause</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
      }

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        swiper.on('autoplayStart', function () {
          if (option.playControl) {
            $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
          }
          if (option.pauseControl) {
            $(option.pauseButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
          }
        });
        swiper.on('autoplayStop', function () {
          if (option.playControl) {
            $(option.playButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
          }
          if (option.pauseControl) {
            $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
          }
        });
      }
    });
  };

  // UiTabPanel
  var UiTabPanel = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      active: 'js-tabpanel-active',
      opened: 'js-tabpanel-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.crrTarget = '';
    _.init();
    _.on();
  };
  $.extend(UiTabPanel.prototype, {
    init: function () {
      var _ = this;
      var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }

      if (_.opener.length && _.item.length) {
        _.hashCode = uiGetHashCode();

        if (!initialOpen) {
          initialOpen = _.opener.eq(0).attr('data-tab-open');
        }

        if (_.options.a11y) {
          _.initA11y();
        }

        _.open(initialOpen, false);
      }
    },
    on: function () {
      var _ = this;
      var openerFocus = false;
      var $focusOpener = null;

      if (_.opener.length && _.item.length) {
        _.opener.on('click.uiTabPanel' + _.hashCode, function (e) {
          var $this = $(this);
          var target = $this.attr('data-tab-open');
          _.open(target);

          if ($this.is('a')) {
            e.preventDefault();
          }
        });
        $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
          var $panel = ($(e.target).is(_.item) && $(e.target)) || ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

          if ($panel && !$panel.is(':hidden')) {
            _.open($panel.attr('data-tab'));
          }
        });
        _.opener
          .on('focus.uiTabPanel' + _.hashCode, function () {
            openerFocus = true;
            $focusOpener = $(this);
          })
          .on('blur.uiTabPanel' + _.hashCode, function () {
            openerFocus = false;
            $focusOpener = null;
          });
        $doc
          .on('keydown.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            if (_.options.a11y && openerFocus) {
              if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                e.preventDefault();
              }
            }
          })
          .on('keyup.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            var target = $focusOpener && $focusOpener.attr('data-tab-open');
            if (_.options.a11y && openerFocus) {
              switch (keyCode) {
                case 35:
                  _.goEnd();
                  break;
                case 36:
                  _.goStart();
                  break;
                case 37:
                  _.prev();
                  break;
                case 38:
                  _.prev();
                  break;
                case 39:
                  _.next();
                  break;
                case 40:
                  _.next();
                  break;
                case 13:
                  _.open(target);
                  break;
                case 32:
                  _.open(target);
                  break;
                default:
                  break;
              }
            }
          });
      }
    },
    open: function (target, focus) {
      var _ = this;
      target = String(target);
      focus = focus instanceof Boolean ? (String(focus) === 'false' ? false : null) : focus;
      var $opener = _.opener.filter('[data-tab-open="' + target + '"]');
      var $panel = _.item.filter('[data-tab="' + target + '"]');

      if (!$panel.hasClass(_.className.opened)) {
        if (_.options.a11y) {
          _.setActiveA11y(target, focus);
        }

        _.crrTarget = target;
        _.opener.not($opener).removeClass(_.className.active);
        _.item.not($panel).removeClass(_.className.opened);
        $opener.addClass(_.className.active);
        $panel.addClass(_.className.opened).trigger('uiTabPanelChange');
      }
    },
    indexOpen: function (i, focus) {
      var _ = this;
      target = Number(i);
      var target = _.opener.eq(i).attr('data-tab-open');

      _.open(target, focus);
    },
    next: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
      if (i >= length) {
        i = 0;
      }
      _.indexOpen(i);
    },
    prev: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
      if (i < 0) {
        i = length - 1;
      }
      _.indexOpen(i);
    },
    goStart: function () {
      var _ = this;
      _.indexOpen(0);
    },
    goEnd: function () {
      var _ = this;
      _.indexOpen(_.opener.length - 1);
    },
    initA11y: function () {
      var _ = this;

      _.opener.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab-open');

        $this
          .attr('role', 'tab')
          .attr('id', 'tabpanel-opener-' + target + '-' + _.hashCode)
          .attr('aria-controls', 'tabpanel-' + target + '-' + _.hashCode);
      });

      _.item.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab');

        $this
          .attr('role', 'tabpanel')
          .attr('id', 'tabpanel-' + target + '-' + _.hashCode)
          .attr('aria-labelledby', 'tabpanel-opener-' + target + '-' + _.hashCode);
      });

      _.wrap.attr('role', 'tablist');
    },
    setActiveA11y: function (target, focus) {
      var _ = this;

      focus = focus === false ? false : true;

      _.opener.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab-open');

        if (crrTarget === target) {
          $this.attr('tabindex', '0').attr('aria-selected', 'true');
          if (focus) {
            $this.focus();
          }
        } else {
          $this.attr('tabindex', '-1').attr('aria-selected', 'false');
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab');

        if (crrTarget === target) {
          $this.removeAttr('hidden');
        } else {
          $this.attr('hidden', '');
        }
      });
    },
    addA11y: function () {
      var _ = this;

      if (!_.options.a11y) {
        _.options.a11y = true;
        _.initA11y();
        _.setActiveA11y(_.crrTarget);
      }
    },
    clearA11y: function () {
      var _ = this;

      if (_.options.a11y) {
        _.options.a11y = false;
        _.opener.removeAttr('role').removeAttr('id').removeAttr('aria-controls').removeAttr('tabindex').removeAttr('aria-selected');

        _.item.removeAttr('role').removeAttr('id').removeAttr('aria-labelledby').removeAttr('hidden');

        _.wrap.removeAttr('role');
      }
    },
  });
  $.fn.uiTabPanel = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      initialOpen: null,
      a11y: false,
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiTabPanel = this.uiTabPanel;

      if (typeof custom === 'object' && !uiTabPanel) {
        options = $.extend({}, defaultOption, custom);
        this.uiTabPanel = new UiTabPanel(this, options);
      } else if (typeof custom === 'string' && uiTabPanel) {
        switch (custom) {
          case 'addA11y':
            uiTabPanel.addA11y();
            break;
          case 'clearA11y':
            uiTabPanel.clearA11y();
            break;
          case 'open':
            uiTabPanel.open(other[0], other[1]);
            break;
          case 'indexOpen':
            uiTabPanel.indexOpen(other[0], other[1]);
            break;
          case 'next':
            uiTabPanel.next();
            break;
          case 'prev':
            uiTabPanel.prev();
            break;
          case 'goStart':
            uiTabPanel.goStart();
            break;
          case 'goEnd':
            uiTabPanel.goEnd();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiAccordion
  var UiAccordion = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-accordion-opened',
      active: 'js-accordion-active',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiAccordion.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();
      _.getElements();

      if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {
        _.item.each(function () {
          var $this = $(this);
          if ($this.attr('data-initial-open') === 'true') {
            _.open($this, 0);
          }
        });
      }

      _.options.onInit();
    },
    getElements: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer);
        } else {
          _.layer = _.options.layer;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }
    },
    on: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.on('click.uiAccordion' + _.hashCode, function () {
          _.toggle($(this).closest(_.item));
        });

        $doc
          .on('keydown.uiAccordion' + _.hashCode, function (e) {
            if (e.keyCode === 9 && _.blockTabKey) {
              e.preventDefault();
            }
          })
          .on('focusin.uiAccordion' + _.hashCode, function (e) {
            var $item = ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) && $(e.target).closest(_.item);

            if ($item) {
              _.open($item, 0);
            }
          });
      }
    },
    off: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.off('click.uiAccordion' + _.hashCode);
        $doc.off('keydown.uiAccordion' + _.hashCode).off('focusin.uiAccordion' + _.hashCode);
      }
    },
    toggle: function ($item) {
      var _ = this;

      if ($item.hasClass(_.className.opened)) {
        _.close($item);
      } else {
        _.open($item);
      }
    },
    open: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if (!$item.hasClass(_.className.opened)) {
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', 'auto');
        $opener = $item.find(_.opener);
        $item.addClass(_.className.opened);
        $opener.addClass(_.className.active);
        $layer.addClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  height: 'auto',
                })
                .trigger('uiAccordionAfterOpened');
            }
          )
          .trigger('uiAccordionOpened', [beforeH, afterH]);

        if (_.options.once) {
          _.item.not($item).each(function () {
            _.close($(this));
          });
        }
      }
    },
    close: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if ($item.hasClass(_.className.opened)) {
        _.blockTabKey = true;
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', '');
        $opener = $item.find(_.opener);
        $item.removeClass(_.className.opened);
        $opener.removeClass(_.className.active);
        $layer.removeClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  display: '',
                  height: '',
                })
                .trigger('uiAccordionAfterClosed');
              _.blockTabKey = false;
            }
          )
          .trigger('uiAccordionClosed', [beforeH, afterH]);
      }
    },
    allClose: function () {
      var _ = this;

      _.item.each(function () {
        _.close($(this));
      });
    },
    update: function (newOptions) {
      var _ = this;

      _.off();
      $.extend(_.options, newOptions);
      _.getElements();
      _.on();
    },
  });
  $.fn.uiAccordion = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      layer: null,
      once: false,
      speed: 500,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiAccordion = this.uiAccordion;

      if (typeof custom === 'object' && !uiAccordion) {
        options = $.extend({}, defaultOption, custom);
        this.uiAccordion = new UiAccordion(this, options);
      } else if (typeof custom === 'string' && uiAccordion) {
        switch (custom) {
          case 'allClose':
            uiAccordion.allClose();
            break;
          case 'close':
            uiAccordion.close(other[0], other[1]);
            break;
          case 'open':
            uiAccordion.open(other[0], other[1]);
            break;
          case 'update':
            uiAccordion.update(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check =
              $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check =
              $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowT = 0;
      var overflowB = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        wrapT = _.wrap.offset().top;
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = _.layer.outerWidth() + _.options.marginLeft + _.options.marginRight;

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        if ($overflow !== null && $overflow.length) {
          overflowT = $overflow.offset().top;
          overflowB = docH - (overflowT + $overflow.height());
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        if (winH - overflowB < layerT + layerH - scrollTop && wrapT - layerH - scrollTop - overflowT >= 0) {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        } else {
          _.wrap.addClass(_.className.bottom);
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
    btnClose: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);

        if (userAgentCheck.isAndroid) {
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide);

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.opener.focus();
            _.layer.trigger('uiDropDownClosed');
          }, 10);
        } else if (userAgentCheck.isIos) {
          _.opener.focus();

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
            _.layer.css(_.css.hide).trigger('uiDropDownClosed');
          }, 100);
        } else {
          _.opener.focus();
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide).trigger('uiDropDownClosed');
        }
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'btnClose':
            uiDropDown.btnClose();
            break;
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $wrap = $('#wrap');
      $html.css('overflow', 'hidden');
      var beforeW = $wrap.width();
      $html.css('overflow', 'scroll');
      var afterW = $wrap.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width)) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if (!$html.hasClass(_.className.block)) {
        scrollBlock.scrollTop = $win.scrollTop();
        scrollBlock.scrollLeft = $win.scrollLeft();

        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var hasScrollBlock = true;
      var isFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $preOpenLayers = $layers.filter('.js-layer-opened').not($layer);
      var notOhterElements = 'script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *, [data-ui-js]';
      var $ohterElements = $('body')
        .find('*')
        .not('[data-layer], [data-layer] *, ' + notOhterElements);
      var $preLayersElements = $preOpenLayers.find('*').not(notOhterElements);

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
        hasScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return hasScrollBlock;
          }
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return isFocus;
          }
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preLayersElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preOpenLayers.attr('aria-hidden', 'true').attr('inert', '').removeAttr('aria-modal');

        if (!$layer.children('.js-loop-focus').length) {
          $('<div class="js-loop-focus" tabindex="0"></div>')
            .on('focusin.uiLayer', function () {
              $layer.focus();
            })
            .appendTo($layer);
        }

        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              $layer.trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .attr('aria-hidden', 'false')
          .attr('aria-modal', 'true')
          .css('visibility', 'visible')
          .removeAttr('hidden')
          .data('layerIndex', $('.js-layer-opened').length);

        if (isFocus) {
          $layer.focus();
        }

        if (hasScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var $opener = $layer.data('layerOpener');
      var $preOpenLayers = $('[data-layer].js-layer-opened').not($layer);
      var $preOpenLayerHasScrollBlock = $preOpenLayers.not(function () {
        var val = $(this).data('scroll-block');
        if (typeof val === 'boolean' && !val) {
          return true;
        } else {
          return false;
        }
      });
      var isScrollBlock = $html.hasClass(scrollBlock.className.block);
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;
      var $ohterElements = $('body').find('[data-ui-js="hidden"]');
      var preOpenLayersHigherZIndex = (function () {
        var array = [];
        $preOpenLayers.each(function () {
          var zIndex = $(this).css('z-index');
          array.push(zIndex);
        });
        array.sort();
        return array[array.length - 1];
      })();
      var $preOpenLayer = $preOpenLayers.filter(function () {
        var zIndex = $(this).css('z-index');

        return zIndex === preOpenLayersHigherZIndex;
      });
      var $preOpenLayerOhterElements = $preOpenLayer.find('[data-ui-js="hidden"]');

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
          .removeAttr('aria-modal')
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if ($preOpenLayer.length) {
                $preOpenLayerOhterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
                $preOpenLayer.attr('aria-hidden', 'false').removeAttr('inert').attr('aria-modal', 'true');
              }

              if (!$preOpenLayers.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
              }

              if (!$preOpenLayerHasScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                $opener.focus();
                $layer.data('layerOpener', null);
              }

              $layer.trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var val = $(this).data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer =
        $layer.length &&
        !($target.is($layer) && $target.data('layerIndex') === lastIndex) &&
        !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      if ($layer.length) {
        uiLayer.open(layer);
        $layer.data('layerOpener', $this);
      }
      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // input disabled class
  function checkDisabledClass() {
    var $inputs = $('.ui-input, .ui-select');
    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block, .ui-select-block');
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

  // fixBarSet
  function fixBarSet() {
    var $layoutWrap = $('.layout-wrap');
    var $top = $('.fix-top-wrap');
    var topH = 0;
    var $fakeTop = $('.js-fake-top');
    var $bottom = $('.fix-bottom-wrap');
    var $fakeBottom = $('.js-fake-bottom');
    var bottomH = 0;

    if ($top.length && !$top.is(':hidden')) {
      topH = $top.outerHeight();
      if (!$fakeTop.length) {
        $layoutWrap.prepend('<div class="js-fake-top"></div>');
        $fakeTop = $('.js-fake-top');
      }
      $fakeTop.height(topH);
    }
    if ($bottom.length && !$bottom.is(':hidden')) {
      bottomH = $bottom.outerHeight();
      if (!$fakeBottom.length) {
        $layoutWrap.append('<div class="js-fake-bottom"></div>');
        $fakeBottom = $('.js-fake-bottom');
      }
      $fakeBottom.height(bottomH);
    }
  }

  // header scroll
  function headerScroll() {
    var $header = $('.header');
    var scrollTop = $win.scrollTop();
    var className = 'is-scroll';

    if (scrollTop > 0) {
      $header.addClass(className);
    } else {
      $header.removeClass(className);
    }
  }

  // checkbox tab
  var checkboxTab = {
    init: function () {
      $('[data-checkbox-tab]').each(function () {
        checkboxTab.update($(this));
      });
    },
    update: function ($input) {
      var name = $input.data('checkbox-tab');
      var $panel = $('[data-checkbox-tab-panel="' + name + '"]');
      var isChecked = $input.is(':checked');

      if (isChecked) {
        $panel.css('display', 'block');
      } else {
        $panel.css('display', 'none');
      }

      $panel.trigger('checkboxTabChange');
    },
  };
  $doc.on('change.checkboxTab', '[data-checkbox-tab]', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var $siblings = $('[name="' + name + '"]').not($this);

    checkboxTab.update($this);
    $siblings.each(function () {
      var $siblingsThis = $(this);
      checkboxTab.update($siblingsThis);
    });
  });

  // checkbox group
  var checkboxGroup = {
    init: function () {
      $('[data-checkbox-group]').each(function () {
        checkboxGroup.update($(this));
      });
    },
    on: function () {
      $doc.on('change.uiJSCheckboxGroup', '[data-checkbox-group], [data-checkbox-group-child]', function (e, eventBy) {
        checkboxGroup.update($(this), eventBy);
      });
    },
    update: function ($input, eventBy) {
      var parentName = $input.attr('data-checkbox-group');
      var childName = $input.attr('data-checkbox-group-child');

      if (typeof childName === 'string' && childName.length) {
        checkboxGroup.updateChild(childName, eventBy);
      }
      if (typeof parentName === 'string' && parentName.length) {
        checkboxGroup.updateParent(parentName, eventBy);
      }
    },
    updateParent: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var checked = $parent.is(':checked');

      if (!(typeof eventBy === 'string' && eventBy === 'checkboxGroupUpdateChild')) {
        $child.each(function () {
          var $thisChild = $(this);
          var beforeChecked = $thisChild.is(':checked');

          if (checked) {
            $thisChild.prop('checked', true).attr('checked', '');
          } else {
            $thisChild.prop('checked', false).removeAttr('checked');
          }

          var afterChecked = $thisChild.is(':checked');

          if (beforeChecked !== afterChecked) {
            $thisChild.trigger('change');
          }
        });
      }
    },
    updateChild: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var length = $child.length;
      var checkedLength = $child.filter(':checked').length;

      $parent.each(function () {
        var $thisParent = $(this);
        var beforeChecked = $thisParent.is(':checked');

        if (length === checkedLength) {
          $thisParent.prop('checked', true).attr('checked', '');
        } else {
          $thisParent.prop('checked', false).removeAttr('checked');
        }

        var afterChecked = $thisParent.is(':checked');

        if (beforeChecked !== afterChecked) {
          $thisParent.trigger('change', 'checkboxGroupUpdateChild');
        }
      });
    },
  };
  checkboxGroup.on();

  // selet tab
  var selectTab = {
    init: function () {
      $('.ui-select').each(function () {
        selectTab.update($(this));
      });
    },
    update: function ($select) {
      var $tapOption = $select.find('[data-select-tab]');

      if (!$tapOption.length) {
        return;
      }

      $tapOption.not(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'none');
      });
      $tapOption.filter(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'block');
      });
    },
  };
  $doc.on('change.selectTab', '.ui-select', function () {
    selectTab.update($(this));
  });

  // area disabled
  var areaDisabled = {
    className: {
      disabled: 'is-area-disabled',
    },
    init: function () {
      $('[data-area-disabled]').each(function () {
        var $this = $(this);
        areaDisabled.eventCall($this);
      });
    },
    eventCall: function ($this) {
      var isRadio = $this.attr('type') === 'radio';
      var name = $this.attr('name');

      if (isRadio) {
        areaDisabled.update($('[name="' + name + '"]').not($this));
      }

      areaDisabled.update($this);
    },
    update: function ($input) {
      var target = $input.attr('data-area-disabled');
      var $inputSiblings = $('[data-area-disabled="' + target + '"]').not($input);
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var isChecked = $input.is(':checked') && !($inputSiblings.length && $inputSiblings.not(':checked').length);
      var selector = 'input, select, button, textarea, fieldset, optgroup';

      if (isChecked) {
        $target.removeClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', false).removeAttr('disabled');
        }
        $target.find(selector).prop('disabled', false).removeAttr('disabled');
      } else {
        $target.addClass(areaDisabled.className.disabled);
        if ($target.is(selector)) {
          $target.prop('disabled', true).attr('disabled', '');
        }
        $target.find(selector).prop('disabled', true).attr('disabled', '');
      }
      checkDisabledClass();
    },
  };
  $doc.on('change.areaDisabled', '[data-area-disabled]', function () {
    var $this = $(this);
    areaDisabled.eventCall($this);
  });

  // check media
  var checkMedia = {
    type: 'pc',
    update: function () {
      var _ = checkMedia;
      var $html = $('html');
      var color = $html.css('outline-color');
      var types = {
        pc: 'rgba(0, 0, 0, 0)',
        tablet: 'rgba(0, 0, 1, 0)',
        mobile: 'rgba(0, 0, 2, 0)',
      };

      $.each(types, function (key, val) {
        if (color === val && !(_.type === key)) {
          _.type = key;
          $html.trigger('uiChangeMedia', _.type);
        }
      });
    },
  };
  window.uiJSCheckMedia = checkMedia;

  // service cards
  var serviceCards = {
    init: function () {
      var count = (checkMedia.type === 'pc' && 3) || (checkMedia.type === 'tablet' && 2) || (checkMedia.type === 'mobile' && 1);

      $('.service-cards').each(function () {
        var $this = $(this);
        var $list = $this.find('.service-cards__list');
        var $items = $this.find('.service-cards__item');
        var $controller = $this.find('.service-cards__controller');
        var length = $items.length;

        $this.data('length', length);

        if (length <= count) {
          $this.addClass('is-only-child');
        }

        $list.swiperSet({
          appendController: $controller,
          nextControl: true,
          prevControl: true,
          slidesPerView: count,
          slidesPerGroup: count,
          on: {
            init: function (swiper) {
              var $currentSlide = $(swiper.slides).filter('[data-swiper-set-slide-index="' + swiper.realIndex + '"]');

              $currentSlide.find('[data-service]').trigger('uiServiceChange');

              if (checkMedia.type === 'mobile') {
                $(swiper.slides).find('.ui-radio').prop('checked', false).removeAttr('checked');
                $currentSlide.find('.ui-radio').prop('checked', true).attr('checked', '');
              }
            },
            slideChange: function (swiper) {
              var $currentSlide = $(swiper.slides).filter('[data-swiper-set-slide-index="' + swiper.realIndex + '"]');

              if (checkMedia.type === 'mobile') {
                $currentSlide.find('[data-service]').trigger('uiServiceChange');

                $(swiper.slides).find('.ui-radio').prop('checked', false).removeAttr('checked');
                $currentSlide.find('.ui-radio').prop('checked', true).attr('checked', '');
              }
            },
          },
        });
      });
    },
    resize: function (type) {
      var count = (type === 'pc' && 3) || (type === 'tablet' && 2) || (type === 'mobile' && 1);

      $('.service-cards').each(function () {
        var $this = $(this);
        var $list = $this.find('.service-cards__list');
        var swiper = $list.data('swiper');
        var length = $this.data('length');
        var index = 0;
        var $currentSlide;

        if (length <= count) {
          $this.addClass('is-only-child');
        } else {
          $this.removeClass('is-only-child');
        }

        if (swiper) {
          swiper.params.slidesPerView = count;
          swiper.params.slidesPerGroup = count;
          swiper.update();

          $currentSlide = (function () {
            var $el = $(swiper.slides).filter('.is-active');
            var $checkedEl = $(swiper.slides).find('.ui-radio:checked').closest('.service-cards__item');
            if ($el.length) {
              return $el;
            } else if ($checkedEl.length) {
              return $checkedEl;
            } else {
              return 0;
            }
          })();

          if ($currentSlide.length) {
            index = Number($currentSlide.attr('data-swiper-set-slide-index'));
            swiper.slideTo(index, 0);
          }
        }
      });
    },
    change: function ($this) {
      var $wrap = $this.closest('.service-cards');
      var $siblings = $wrap.find('[data-service]').not($this);
      var $item = $this.closest('.service-cards__item');
      var name = $this.attr('data-service');
      var $contents = $('[data-service-contents="' + name + '"]');

      if (!$item.hasClass('is-active')) {
        $siblings.each(function () {
          var $siblingsThis = $(this);
          var $siblingsItem = $siblingsThis.closest('.service-cards__item');
          var siblingsName = $siblingsThis.attr('data-service');

          $siblingsItem.removeClass('is-active');
          $('[data-service-contents="' + siblingsName + '"]')
            .css('display', 'none')
            .removeClass('is-show');
        });

        if ($contents.hasClass('js-ui-tab-panel')) {
          $contents.uiTabPanel('goStart');
        }

        $contents.find('.js-ui-tab-panel').uiTabPanel('goStart');

        $item.addClass('is-active');
        $contents.css('display', 'block').addClass('is-show');
      }
    },
  };
  $win.on('uiChangeMedia.serviceCards', function (e, type) {
    serviceCards.resize(type);
  });
  $doc
    .on('click.serviceCards', '[data-service]', function () {
      $(this).trigger('uiServiceChange');
    })
    .on('uiServiceChange.serviceCards', '[data-service]', function () {
      serviceCards.change($(this));
    });

  // input image
  var inputImage = {
    init: function () {
      $('.ui-input-image__input').each(function () {
        var $this = $(this);
        inputImage.update($this);
      });
    },
    update: function ($input) {
      var $wrap = $input.closest('.ui-input-image');
      var $img = $wrap.find('.ui-input-image__veiw-image img');
      var file = $input.get(0).files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        src = e.target.result;
        $img.attr('src', src);
        $wrap.addClass('is-load');
      };
      reader.readAsDataURL(file);
    },
    delete: function ($wrap) {
      var $input = $wrap.find('.ui-input-image__input');
      var $img = $wrap.find('.ui-input-image__veiw-image img');

      $input.val('').focus();
      $img.attr('src', '');
      $wrap.removeClass('is-load');
    },
  };
  $doc
    .on('change.inputImage', '.ui-input-image__input', function () {
      var $this = $(this);
      inputImage.update($this);
    })
    .on('click.inputImage', '.ui-input-image__delete', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-image');
      inputImage.delete($wrap);
    });

  // datepicker
  function datepicker() {
    var locale = $('html').attr('lang');

    $('.js-datepicker-range').each(function () {
      var $this = $(this);
      var $min = $this.find('.js-datepicker-range__min');
      var $max = $this.find('.js-datepicker-range__max');
      $min.datetimepicker({
        locale: locale,
        format: 'YYYY.MM.DD',
        //dayViewHeaderFormat: 'YYYY년 MMMM',
      });
      $max.datetimepicker({
        locale: locale,
        format: 'YYYY.MM.DD',
        //dayViewHeaderFormat: 'YYYY년 MMMM',
        useCurrent: false,
      });
      $min.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $max.data('DateTimePicker').minDate(e.date);
      });
      $max.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $min.data('DateTimePicker').maxDate(e.date);
      });
    });

    $('.js-datepicker').datetimepicker({
      locale: locale,
      format: 'YYYY.MM.DD',
      //dayViewHeaderFormat: 'YYYY년 MMMM',
    });
  }

  // console report view
  var consoleReportView = {
    init: function () {
      $('.console-report-view').each(function () {
        consoleReportView.update($(this));
      });
    },
    update: function ($wrap) {
      var $item = $wrap.find('.console-report-view__item');
      var $num = $wrap.find('.console-report-view__num');
      var width = Number($wrap.attr('data-origin-width'));
      var height = Number($wrap.attr('data-origin-height'));
      var perWidth = 100 / width;
      var perHeight = 100 / height;

      function getPosition(string) {
        var position = string.replace(/\s/g, '').split(',');
        $.each(position, function (i) {
          position[i] = Number(this);
        });
        return position;
      }

      $item.each(function () {
        var $this = $(this);
        var position = getPosition($this.attr('data-position'));
        $this.css({
          left: (perWidth * position[0]).toFixed(6) + '%',
          top: (perHeight * position[1]).toFixed(6) + '%',
          width: (perWidth * (position[2] - position[0])).toFixed(6) + '%',
          height: (perHeight * (position[3] - position[1])).toFixed(6) + '%',
        });
      });
      $num.each(function () {
        var $this = $(this);
        var position = getPosition($this.attr('data-position'));
        $this.css({
          left: (perWidth * position[0]).toFixed(6) + '%',
          top: (perHeight * position[1]).toFixed(6) + '%',
        });
      });
      $wrap.addClass('is-load');
    },
  };

  // common js
  function uiJSCommon() {
    checkScrollbars();
    checkDisabledClass();
    checkboxGroup.init();
    checkboxTab.init();
    selectTab.init();
    areaDisabled.init();
    inputImage.init();

    $('.js-ui-tab-panel').each(function () {
      var $this = $(this);
      var initial = $this.attr('data-initial');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-tab-panel');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('[data-tab]').filter(filter);
      var $openers = $this.find('[data-tab-open]').filter(filter);

      $this.uiTabPanel({
        a11y: true,
        item: $items,
        opener: $openers,
        initialOpen: initial,
      });
    });

    $('.js-ui-accordion').each(function () {
      var $this = $(this);
      var once = $this.attr('data-once') === 'true';
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-accordion');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('.js-ui-accordion__item').filter(filter);
      var $openers = $this.find('.js-ui-accordion__opener').filter(filter);
      var $layers = $this.find('.js-ui-accordion__layer').filter(filter);

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
          once: once,
        });
      }
    });

    $('.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });
    $('.js-ui-dropdown-hover').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
    });

    $('.gnb__list').each(function () {
      var $this = $(this);
      var $items = $this.find('.gnb__item');
      var $openers = $this.find('.gnb__opener');
      var $layers = $this.find('.gnb__depth');

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $items.filter('.is-active').attr('data-initial-open', 'true');
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      }
    });

    serviceCards.init();
    consoleReportView.init();
    datepicker();

    $('.home-slide__list').swiperSet({
      effect: 'fade',
      pageControl: true,
      scrollbarControl: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        type: 'fraction',
      },
      scrollbar: {
        draggable: true,
        hide: false,
      },
    });

    $('.ui-rangeslider').each(function () {
      var $this = $(this);
      var $input = $this.find('[type="range"]');
      var $bubble = $this.find('.ui-rangeslider__bubble');
      var watch = $this.attr('data-rangeslider-watch');
      var $watch = null;
      var isComma = $this.attr('data-rangeslider-watch-comma') === 'true';
      var orientation = $input.attr('data-orientation') || 'horizontal';

      if (typeof watch === 'string') {
        $watch = $(watch);
      }

      function bubbleUpdate(position, value) {
        if ($bubble.length) {
          if (orientation === 'horizontal') {
            $bubble.css('left', position);
          } else if (orientation === 'vertical') {
            $bubble.css('bottom', position);
          }
        }
        if ($watch && $watch.length) {
          if (isComma) {
            $watch.text(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
          } else {
            $watch.text(value);
          }
        }
      }

      $input.rangeslider({
        polyfill: false,
        onInit: function () {
          $input.data('rangeslider', this);
          bubbleUpdate(this.position, this.value);
        },
        onSlide: function (position, value) {
          bubbleUpdate(position, value);
        },
      });
    });
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    checkMedia.update();
    fixBarSet();

    $('.ui-rangeslider').each(function () {
      var $this = $(this);
      var $input = $this.find('[type="range"]');
      var $bubble = $this.find('.ui-rangeslider__bubble');
      var orientation = $input.attr('data-orientation') || 'horizontal';
      var position = 0;
      var rangeslider = $input.data('rangeslider');
      var timer = $this.data('rangesliderTimer');

      clearTimeout(timer);

      timer = setTimeout(function () {
        if (rangeslider) {
          position = $input.data('rangeslider').position;
        }

        if ($bubble.length) {
          if (orientation === 'horizontal') {
            $bubble.css('left', position);
          } else if (orientation === 'vertical') {
            $bubble.css('bottom', position);
          }
        }
      }, 350);

      $this.data('rangesliderTimer', timer);
    });
  }
  window.uiJSResize = uiJSResize;

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus');
          }, 100)
        );
      });
  }
  areaFocus('.ui-select-block');
  areaFocus('.ui-input-block');
  areaFocus('.header-gnb__item');
  areaFocus('.ui-tooltip');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.ui-input', function () {
    inputedCheck($(this), '.ui-input-block');
  });

  // input delete
  /*
  $doc.on('click.inputDelete', '.ui-input-delete', function () {
    var $this = $(this);
    var $input = $this.closest('.ui-input-block').find('.ui-input');

    $input.val('').trigger('focus');
  });
  */

  // layer opened scroll to start
  $doc.on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
    var $this = $(this);
    var $scroller = $this.find('.ui-layer__body');

    $this.scrollTop(0).scrollLeft(0);
    $scroller.scrollTop(0).scrollLeft(0);
  });

  // pc mode gnb close
  $win.on('uiChangeMedia.uiGNB', function (e, type) {
    if (type === 'pc') {
      uiJSLayer.close('layer-gnb');
    }
  });

  // dropdown
  $doc
    .on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');

      $wrap.uiDropDown('btnClose');
    })
    .on('click.uiJSDropdown', '[data-dropdown-option]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');
      var $watch = $wrap.find('.js-ui-dropdown__watch');
      var text = $this.attr('data-dropdown-option');

      $watch.text(text);

      e.preventDefault();
    });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    if (userAgentCheck.isIos) {
      $('meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no');
      $html.addClass('is-ios-os');
    }

    if (userAgentCheck.isAndroid) {
      $html.addClass('is-android-os');
    }

    scrollbarsWidth.set();
    uiJSCommon();
    headerScroll();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-top-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-bottom-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      uiJSResize();
    })
    .on('scroll.uiJS', function () {
      headerScroll();
    })
    .on('resize.uiJS', function () {
      uiJSResize();
      headerScroll();
    })
    .on('orientationchange', function () {
      uiJSResize();
      headerScroll();
    });
})(jQuery);
