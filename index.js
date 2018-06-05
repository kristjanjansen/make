
// Set up the SVG scene

make = m = new Rune({ container: "#rune", width: 5000, height: 5000, debug: true })

// Set up grid

make.grid({ moduleWidth: 50, moduleHeight: 50, columns: 30, rows: 20 })
make.grid({ moduleWidth: 100, moduleHeight: 100, columns: 15, rows: 10 })

// Add document styling and grid styling


const el = document.createElement('style')
el.innerText = `
    body { margin: 0; padding: 50px; font-family: sans-serif; }
    svg g:nth-child(1) > * { stroke: rgba(52, 177, 249, 0.15); }
    svg g:nth-child(1) > rect { stroke: rgba(52, 177, 249, 0.4); }
    svg g:nth-child(2) > * { stroke: rgba(52, 177, 249, 0.3); }
    .label {
        position: absolute;
        top: 15px;
        width: 50px;
        color: rgba(52, 177, 249, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
    }
`
document.querySelector('head').appendChild(el)

// General utilities 

round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

random = gimme = something = anything = (a, b) => {
    if (typeof b === 'undefined') {
        b = a
        a = 0
    }
    return Math.floor(round(a + Math.random() * (b - a), 2))
}

scale = sc = (value, start1, stop1, start2, stop2) => {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2
}

circlex = cx = (deg, radius) => {
    return Math.cos((deg - 90) * (Math.PI / 180)) * radius
}

circley = cy = (deg, radius) => {
    return Math.sin((deg - 90) * (Math.PI / 180)) * radius
}

show = log = data => console.log(JSON.stringify(data,null,2))

// Array utilities

Array.prototype.step = Array.prototype.s =
    function (step) {
        return this.map(value => value * step)
    }

Array.prototype.add =
    Array.prototype.plus =
    Array.prototype.increase =
    Array.prototype.inc =
    Array.prototype.from =
    function (add) {
        return this.map(value => value + add)
    }


Array.prototype.subtract =
    Array.prototype.remove =
    Array.prototype.minus =
    Array.prototype.decrease =
    Array.prototype.dec =
    function (subtract) {
        return this.map(value => value - subtract)
    }

Array.prototype.start = Array.prototype.end = function (start) {
    return this.filter(value => value >= stop)
}

Array.prototype.stop = Array.prototype.end = function (stop) {
    return this.filter(value => value <= stop)
}

Array.prototype.between = function (start, end) {
    return this.map(value => scale(
        value, this[0],
        this[this.length - 1],
        start,
        end
    ))
}

Array.prototype.scale = Array.prototype.s = function (start1, stop1, start2, stop2) {
    return this.map(value => scale(value, start1, stop1, start2, stop2))
}

Array.prototype.only = function (key) {
    return this.map(item => item[key])
}

Array.prototype.show = function () {
    show(this)
    return this
}

Array.prototype.column = function(key) {
  return this.map(item => item[key]);
};

Array.prototype.row = function(index) {
  return Object.values(this[index]);
};

Array.prototype.withoutFirst = function (count = 1) {
    this.splice(0, count)
    return this
};

Array.prototype.withoutLast = function(count = 1) {
  this.splice(-count, count);
  return this;
};

// Array aliases for those precious young coder hands

Array.prototype.foreach = Array.prototype.f = Array.prototype.each =
    Array.prototype.forEach

Array.prototype.count = Array.prototype.length

// Boolean aliases

no = none = nope = 'none'

// Numbers utility

numbers = number = n = data = function(value) {
    if (arguments.length > 1) {
        return [...arguments]
    }
    if (typeof value == 'object') {
        return value
    }
    if (typeof value == 'number') {
        return Array.from({ length: value }, (v, i) => i)
    }
}

// Fetch data from Google Sheets

google = sheet = sheets = async key => {
    const res = await fetch(`https://spreadsheets.google.com/feeds/list/${key}/od6/public/values?alt=json`)
    const json = await res.json()
    return await parseSheet(json)
}

// Parse the spreadsheet data into a usable form

parseSheet = async data => {
    return data.feed.entry.map(entry => {
        return Object.keys(entry)
            .map(field => {
                if (field.startsWith('gsx$')) {
                    return [
                        field.split('$')[1],
                        entry[field].$t
                    ]
                }
            })
            .filter(field => field)
            .reduce((field, item) => {
                field[item[0]] = item[1]
                return field
            }, {})
    })
}

// Animations

spin = (target, rotationX = 0, rotationY = 0, duration = 10000, reverse = false) => {
    target.state.rotationX = rotationX
    target.state.rotationY = rotationY
    target.changed()
    anime({
        targets: target.state,
        duration,
        update: () => { target.changed() },
        rotation: 359.999,
        easing: 'linear',
        loop: true,
        direction: reverse ? 'reverse' : 'normal'
    })
}

// Colors

hsl = hsb = hue = h = function (h, s, l, a = 1) {
    if (arguments.length <= 2) {
        s = 100
        l = 50
    }
    h /= 360
    s /= 100
    l /= 100
    let r, g, b
    if (s === 0) {
        r = g = b = l // achromatic
    } else {
        hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        q = l < 0.5 ? l * (1 + s) : l + s - l * s
        p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

gray = 200
red = '#DB504A'
blue = '#5B85AA'
yellow = '#F2AF29'
lilac = '#372248'
orange = '#DD6031'
cyan = '#48ACF0'
green = '#5BC0BE'

colors = index => {
    const colors = [red,blue,yellow,lilac,orange,cyan,green]
    return colors[index % colors.length]
}

// Adding labels

document.querySelector('#help').innerHTML =
    numbers(16).step(100).map(n => `
        <div class="label" style="opacity: 0.5; top: 15px; left:${n + 25}px;">${n}</div>
    `).join('')
    +
    numbers(15).step(100).add(50).map(n => `
        <div class="label" style="opacity: 0.2; top: 15px; left:${n + 25}px;">${n}</div>
    `).join('')
    +
    numbers(11).step(100).map(n => `
        <div class="label" style="opacity: 0.5; top: ${n + 40}px; left:0px;">${n}</div>
    `).join('')
    +
    numbers(10).step(100).add(50).map(n => `
        <div class="label" style="opacity: 0.2; top: ${n + 40}px; left:0px;">${n}</div>
    `).join('')