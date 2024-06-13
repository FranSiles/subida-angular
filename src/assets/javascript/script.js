anime({
    targets: '#carpeta',
    translateY: [
      { value: -50, duration: 1000, easing: 'easeInOutSine' },
      { value: 0, duration: 1000, easing: 'easeInOutSine' }
    ],
    loop: true
  });

  anime({
    targets: '#fondocuatro',
    fill: [
      { value: '#fbcc08', duration: 499 },
      { value: '#383821', duration: 501 }
    ],
    loop: true
  });
anime({
    targets: '#ojos',
  rotate: {
    value: '+=360',
    duration: 2000,
    easing: 'linear',
    },loop: true
  });


anime({
    targets: '#ojos2',
  rotate: {
    value: '-=360',
    duration: 2000,
    easing: 'linear',
    },loop: true
  });