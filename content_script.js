(function(win) {
    Notification.requestPermission((status) => {
        if (status != "granted") {
            return;
        }
        const appElement = document.querySelector("#app");
        const OutlookMutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const bodyObserver = new OutlookMutationObserver(check);
        bodyObserver.observe(win.document.body, {
            childList: true,
            subtree: true
        });

        function check() {
            // Find the "Reminders" portal element.
            const portalElements = document.querySelectorAll('[data-portal-element="true"]');
            for (const elem of portalElements) {
                const compStyle = win.getComputedStyle(elem);
                if (compStyle.getPropertyValue("z-index") == 10000000) {
                    const portalElementObs = new OutlookMutationObserver(notifyReminder);
                    portalElementObs.observe(elem, {
                        childList: true,
                        subtree: true
                    });
                    bodyObserver.disconnect();
                    break;
                }
            }
        }

        function notifyReminder(mutations) {
            mutations.forEach(function(mutation) {
                const items = document.evaluate(".//div[@data-is-focusable='true']/button/*[@data-automationid='splitbuttonprimary']", mutation.target);
                let item = items.iterateNext();
                while (item) {
                    const info = item.querySelector(":scope > :nth-child(2)");
                    const descriptionElem = info.querySelector(":scope > :nth-child(1)");
                    const description = descriptionElem.innerText;
                    const timeElem = info.querySelector(":scope > :nth-child(2)");
                    const time = timeElem.innerText;
                    let notification = new Notification(description, {
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEfklEQVRoge2YW2xURRjHf3PO2e6tu9ttt90ChSIFShOFtoGgGC/4RBVD8AWMMb6pQWM0MWKQ8KDwYkQT44uSyIO3aOLlyRJf1BCREBIjyM3GykVol+122fa0u3TPnvGhtKXdyznt2VpM9vc43zfffP85c2bmG6hQoUKFhUQ4DRDY8uHrpmCvAH85EipCSgj5yvD3zx+eaXAmoOt9dzVuHdAcxbFHTO9+rnFmo6OBQ4rmk4qrr5SPAKTXbRlL9XssPMybhVodCQjXL5KGFEtLDqsqw8baloBFqMHGB9bUWvhkknkLCBSLTnc8FQELzf9eQP5P3HXwZST7sbGvX+zvLWoTQhCqrsMXCDtK0Ir8L2AzeSuklKT0hNMwlhTaRst2okopkQbXhCF9pfwUoQ6bhhgpGQtZ/nPADjeGzMXR65Q8ByS5wWRcWJwDIlOoddYC6oIeWptqyeUkf1waYCSTnW2IsmJbQDTs44Ndj7B90ypUZfwKlR4zONR9mt0fHyUzZsxbkqWwJSDoq+Lnt3fQ2hQmnkpz5OTf+NwuujbcxUvbOli9JMxj+77FlHK+883DloA9OzfS2hSmtz/Fg69+ydWEDkBHSwNH39nBlvXL2flwK5//eH5eky2ErYPsqc1rANj/xfHJ5AF+++s6H3WfuuXTNg/pWWMpIOR30xQZ30SOnb2WZz92dvw2fXdzpMypzcAw3I0t+7pmNlsuoYkfFiBrmHn2bC437qcWqY1MJQO4Sg4iRAY5vs9L09SEKdU8H8MQWsj/HTCtuLAUkNQzDAyliQS9dKxsoLc/Nc3euTIKQM/VZMH+VelBt56qL1mtSKTH+KmnZNXj8is07H26iid2T2u3XEJSwje/9ACwZ8dG/J6pyVxSV82uresA+PqWT7kRLoWa9giLtrWgrViUZ7e1C7352XG2b1pF58oGfn3vSQ7/cAavW+OFreuIBL383hvnUPfpMmcO/hVBwh0RVG/xNG0JuJrQ2bz7Kz597VHaV9Tz7rMPTdqOnLzIMwePcDObc570LTyNPmrX1+MKW9fStk/iM5cSdL74CRtWN9K2tJacKTnZE+P8lUFHyd6OK1hFTXsdvmarEnqKWd2FpIQTF/o5caHfdh/hcVk+3Sgelwh3Rgi0hRHK7F565v02qj5+XzV9I9A3Mj4DtyEUgXdNPYF7l9ao7tI7bTEKCdCB6jlFm4HQNHBpQi4LQdSP+GcYBkZBgmd5mND9zahBDzh4YCsk4A3gAA5FCE3Dt/aeqQa3hmwJozQH4zXL6kxvNBB1En9ynLl2rDt82dHV01vjI7gkhFY1u1V8ql1My/m/eNMsSPrGKJmhNP76AMFoEFHsKmLBgj6rSFOix4aInetjNKEzl096R7wL5bI5kpeTxC/EGNML1u5FuSMETJAdHSPec51E7wC5m/ZK1AX7B0qRSaWJDWXw1voJLg6hasXnee5fQKBbO80dKSWjCZ34uT5GBvSJM3B4pt+cBaiK+pZQRH6FU2ZyhsmNK0nif8Zy2bRxYL7Hq1ChQoXZ8S+QOlIdCqNTRAAAAABJRU5ErkJggg==',
                        body: time,
                        requireInteraction: false,
                    });
                    notification.onclick = function() {
                        win.focus();
                        item.click();
                        this.close();
                    };
                    item = items.iterateNext();
                }

                const items1 = document.evaluate(".//button[@data-is-focusable='true']/*[@data-automationid='splitbuttonprimary']", mutation.target);
                let item1 = items1.iterateNext();
                while (item1) {
                    const info1 = item1.querySelector(":scope > :nth-child(2)");
                    const descriptionElem1 = info1.querySelector(":scope > :nth-child(1)");
                    const description1 = descriptionElem1.innerText;
                    const timeElem1 = info1.querySelector(":scope > :nth-child(2)");
                    const time1 = timeElem1.innerText;
                    let notification = new Notification(description1, {
                        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEfklEQVRoge2YW2xURRjHf3PO2e6tu9ttt90ChSIFShOFtoGgGC/4RBVD8AWMMb6pQWM0MWKQ8KDwYkQT44uSyIO3aOLlyRJf1BCREBIjyM3GykVol+122fa0u3TPnvGhtKXdyznt2VpM9vc43zfffP85c2bmG6hQoUKFhUQ4DRDY8uHrpmCvAH85EipCSgj5yvD3zx+eaXAmoOt9dzVuHdAcxbFHTO9+rnFmo6OBQ4rmk4qrr5SPAKTXbRlL9XssPMybhVodCQjXL5KGFEtLDqsqw8baloBFqMHGB9bUWvhkknkLCBSLTnc8FQELzf9eQP5P3HXwZST7sbGvX+zvLWoTQhCqrsMXCDtK0Ir8L2AzeSuklKT0hNMwlhTaRst2okopkQbXhCF9pfwUoQ6bhhgpGQtZ/nPADjeGzMXR65Q8ByS5wWRcWJwDIlOoddYC6oIeWptqyeUkf1waYCSTnW2IsmJbQDTs44Ndj7B90ypUZfwKlR4zONR9mt0fHyUzZsxbkqWwJSDoq+Lnt3fQ2hQmnkpz5OTf+NwuujbcxUvbOli9JMxj+77FlHK+883DloA9OzfS2hSmtz/Fg69+ydWEDkBHSwNH39nBlvXL2flwK5//eH5eky2ErYPsqc1rANj/xfHJ5AF+++s6H3WfuuXTNg/pWWMpIOR30xQZ30SOnb2WZz92dvw2fXdzpMypzcAw3I0t+7pmNlsuoYkfFiBrmHn2bC437qcWqY1MJQO4Sg4iRAY5vs9L09SEKdU8H8MQWsj/HTCtuLAUkNQzDAyliQS9dKxsoLc/Nc3euTIKQM/VZMH+VelBt56qL1mtSKTH+KmnZNXj8is07H26iid2T2u3XEJSwje/9ACwZ8dG/J6pyVxSV82uresA+PqWT7kRLoWa9giLtrWgrViUZ7e1C7352XG2b1pF58oGfn3vSQ7/cAavW+OFreuIBL383hvnUPfpMmcO/hVBwh0RVG/xNG0JuJrQ2bz7Kz597VHaV9Tz7rMPTdqOnLzIMwePcDObc570LTyNPmrX1+MKW9fStk/iM5cSdL74CRtWN9K2tJacKTnZE+P8lUFHyd6OK1hFTXsdvmarEnqKWd2FpIQTF/o5caHfdh/hcVk+3Sgelwh3Rgi0hRHK7F565v02qj5+XzV9I9A3Mj4DtyEUgXdNPYF7l9ao7tI7bTEKCdCB6jlFm4HQNHBpQi4LQdSP+GcYBkZBgmd5mND9zahBDzh4YCsk4A3gAA5FCE3Dt/aeqQa3hmwJozQH4zXL6kxvNBB1En9ynLl2rDt82dHV01vjI7gkhFY1u1V8ql1My/m/eNMsSPrGKJmhNP76AMFoEFHsKmLBgj6rSFOix4aInetjNKEzl096R7wL5bI5kpeTxC/EGNML1u5FuSMETJAdHSPec51E7wC5m/ZK1AX7B0qRSaWJDWXw1voJLg6hasXnee5fQKBbO80dKSWjCZ34uT5GBvSJM3B4pt+cBaiK+pZQRH6FU2ZyhsmNK0nif8Zy2bRxYL7Hq1ChQoXZ8S+QOlIdCqNTRAAAAABJRU5ErkJggg==',
                        body: time1,
                        requireInteraction: false,
                    });
                    notification.onclick = function() {
                        win.focus();
                        item1.click();
                        this.close();
                    };
                    console.log('Complete Mail Alert');
                    item1 = items1.iterateNext();
                }
            });
        }
    });
})(this);

