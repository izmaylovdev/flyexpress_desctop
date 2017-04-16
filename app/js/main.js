let popup = $('.popup'),
    trigger = $('.popup-trigger'),
    cover = $('.popup__cover'),
    popupBody = $('.popup__body');

    popupBody.on('click', (event) =>  event.stopPropagation());
    trigger.on('click', (event) => { popup.addClass('popup_active'); event.preventDefault() });
    cover.on('click', (event) => { popup.removeClass('popup_active'); event.preventDefault() });

let tabs = $('.tabs'),
    links = $('.tabs__link'),
    items = $('.tabs__tab');

    links.on('click', function (event){
        let index = links.index(event.target);
        items.removeClass('tabs__tab_active');
        items.eq(index).addClass('tabs__tab_active');
    });

let gambLink = $('.admin__pic-link');

    gambLink.on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
        $(event.target).closest('tr').next().toggle(0);
    })