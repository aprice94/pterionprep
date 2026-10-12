---
title: "Shunt Valves — How They Work"
description: "Everything to know about CSF shunt valves: opening pressure, units (mmH2O vs mmHg), the siphon effect, valve mechanisms, siphon-control and gravitational (anti-gravity) devices, MRI behaviour and safe adjustment — with a pressure converter and valve library."
category: "Shunts"
tags: ["shunt", "valve", "hydrocephalus", "siphon", "gravitational", "anti-siphon", "programmable", "MRI", "opening pressure"]
---

# Shunt Valves — How They Work

<div class="tool-hero compact">
  <div>
    <span class="eyebrow">Pterion Prep · Shunts</span>
    <h2>Everything about shunt valves, in one place</h2>
    <p>Start here for the physics and device types, then look up any valve's settings in mmH₂O and mmHg, convert a setting between brands, or identify a valve on X-ray. Every number on these pages is taken from the manufacturer's instructions for use, brochure or an FDA record — sources are linked on each valve card.</p>
  </div>
  <div class="tool-stat-grid">
    <a href="{{ '/shunts/converter/' | relative_url }}"><b>🔁 Pressure converter</b><span>Setting → mmH₂O / mmHg → equivalent on any valve</span></a>
    <a href="{{ '/shunts/valves/' | relative_url }}"><b>🗂️ Valve library</b><span>{{ site.data.shunt_valves | size }} valves &amp; devices: settings, MRI, X-ray</span></a>
    <a href="{{ '/shunts/xray-id/' | relative_url }}"><b>🩻 Identify by X-ray</b><span>Radiographic gallery</span></a>
  </div>
</div>

<div class="decision-strip">
  <a href="#units">Units</a><a href="#opening-pressure">Opening pressure</a><a href="#siphon">Posture &amp; siphoning</a><a href="#mechanisms">Mechanisms</a><a href="#siphon-control">Anti-siphon devices</a><a href="#gravitational">Gravitational units</a><a href="#mri">MRI</a><a href="#adjusting">Adjusting safely</a><a href="#recommendations">Starting pressures</a><a href="#recalls">Recalls</a>
</div>

> **Educational reference only.** Device behaviour depends on the exact model, configuration, catheters and patient. Confirm against the implant record, the current IFU and your attending before changing any setting.

## The 60-second version

- A shunt valve is a **one-way resistor**: it opens when the pressure *difference* across it (inlet minus outlet) exceeds its **opening pressure**, and the faster CSF flows, the higher that pressure climbs.
- **Lying down**, that difference is roughly ventricular pressure minus distal-cavity pressure.
- **Sitting or standing**, the column of CSF in the distal catheter adds suction — the **siphon effect** — so a valve that is right for lying can overdrain upright.
- **Programmable valves** let you change the opening pressure through the skin. **Siphon-control** and **gravitational** devices add resistance only when it is needed upright.
- Valves are labelled in **mmH₂O** (Codman, Medtronic, Sophysa) or **cmH₂O** (Miethke); ICP monitors read in **mmHg**. 1 mmHg ≈ 13.6 mmH₂O.

## 1. Pressure units {#units}

| Unit | In mmH₂O | Used by |
|------|----------|---------|
| 1 mmH₂O | 1 | Codman/Integra, Medtronic, Sophysa valve settings |
| 1 cmH₂O | 10 | Miethke / B. Braun valves, manometers, LP opening pressure |
| 1 mmHg | 13.595 | ICP monitors, physiology texts |
| 1 kPa | 101.97 | SI literature |

Manufacturer shorthand: Miethke uses 1 mmHg ≈ 1.36 cmH₂O (and 1 cmH₂O ≈ 0.74 mmHg); Sophysa states 1 mmH₂O = 9.807 Pa = 0.074 mmHg.

| mmH₂O | cmH₂O | mmHg |
|-------|-------|------|
| 50 | 5 | 3.7 |
| 100 | 10 | 7.4 |
| 136 | 13.6 | 10 |
| 150 | 15 | 11.0 |
| 200 | 20 | 14.7 |
| 204 | 20.4 | 15 |
| 272 | 27.2 | 20 |
| 400 | 40 | 29.4 |

Use the [quick unit converter]({{ '/shunts/converter/' | relative_url }}#sv-unit-h) for any other value.

## 2. What "opening pressure" really means {#opening-pressure}

**It is a pressure-flow curve, not a single number.** Each valve passes more CSF as the pressure difference rises, so manufacturers quote the pressure at a reference flow — and they do not all use the same one:

| Manufacturer / valve | How the labelled pressure is defined | Stated tolerance |
|---|---|---|
| Codman HAKIM programmable | Nominal setting (30–200 mmH₂O, 10-mm steps) | ±14 (30–120), ±19 (130–200) mmH₂O |
| Codman CERTAS Plus | Average across 5–50 mL/h | ±20 (1–3), ±25 (4), ±35 (5–7) mmH₂O |
| Codman HAKIM Precision (fixed) | Labelled operating pressure | ±10 mmH₂O |
| Medtronic Strata, Delta, CSF-Flow Control | Median range from 5 to 50 mL/h | Strata NSC: ±15–25 mmH₂O |
| Sophysa Polaris, Sophy | At 10 mL/h, valve alone | −10 / +15 mmH₂O |
| Miethke gravitational units | At 5 mL/h (≈1–2 cmH₂O higher at 20 mL/h) | — |

**Catheters add resistance.** Integra's L-P IFU shows the gap: a HAKIM valve set at 30 mmH₂O measured **61 mmH₂O** with a 120 cm peritoneal catheter at 20 mL/h, and setting 200 measured 229. Sophysa labels the valve alone and notes the catheters add their own resistance; Medtronic's small-lumen peritoneal catheter limits flow about six-fold versus a standard one at 20 mL/h.

**So "the same number" on two brands is only approximately the same pressure** — which is why the [converter]({{ '/shunts/converter/' | relative_url }}) reports the closest setting, the difference, and the next setting above and below.

## 3. Posture, hydrostatics and the siphon effect {#siphon}

Miethke's IFUs give the cleanest model. With P<sub>L</sub> the valve opening pressure lying, P<sub>S</sub> the opening pressure upright, P<sub>H</sub> the hydrostatic column from the ventricles (foramen of Monro) down to the distal cavity, and P<sub>B</sub> the abdominal pressure:

- **Lying:** IVP = P<sub>L</sub> + P<sub>B</sub>
- **Upright:** IVP = P<sub>H</sub> − P<sub>S</sub> − P<sub>B</sub> — i.e., the hydrostatic column pulls CSF out unless the valve's upright opening pressure nearly matches it.

In an upright adult the column is tens of centimetres (42 cm in Miethke's worked example), far above any lying setting — so a differential-pressure valve alone lets IVP fall well below zero when the patient stands: **overdrainage**, with slit ventricles, low-pressure headache, hygroma or subdural haematoma. Raising the setting to stop it simply under-drains the patient when lying. The fix is a device that adds resistance **only upright**, which is what the next two sections are about.

Medtronic simulates the upright patient by testing at **−50 cmH₂O** hydrostatic pressure; Miethke aims for a slightly negative standing IVP (the DualSwitch valve targets −5 to +5 cmH₂O).

## 4. Valve mechanisms {#mechanisms}

| Mechanism | How it works | Examples |
|---|---|---|
| **Ball-in-cone (spring-loaded)** | A ball (synthetic ruby / sapphire) is pressed into a conical seat by a spring; the spring force sets the opening pressure | Codman HAKIM, CERTAS Plus, HAKIM Precision; Sophysa Polaris, Sophy; Miethke DP units; Integra DP (two in series); Medtronic Strata/StrataMR II ball-and-cone |
| **Membrane / diaphragm** | A flexible membrane seals an outlet until pressure lifts it | Medtronic Delta, CSF-Flow Control (non-metallic) |
| **Slit valve** | Silicone slits open under pressure | Historic Holter / Spitz-Holter; distal slit "closing-pressure" catheters (Medtronic: low 0.5–5.4, medium 5.5–9.4, high 9.5–14.4 cmH₂O — not flow-control valves) |
| **Flow-regulating** | Variable resistance keeps flow near CSF production instead of holding a set pressure | Integra OSV II (18–30 mL/h; Low Flow model 8–17 mL/h) |
| **Adjustable flow resistance** | A rotor sets the length of a flow channel; can switch the shunt off | Miethke M.flow (used with M.blue) |

**How programmable valves change setting:** HAKIM — a codified magnetic signal drives a stepper motor that turns a cam under the spring. CERTAS Plus — a magnetically rotated construct. Strata — a magnet-driven mechanism read with hand tools or StrataVarius. Polaris — a rotor held by a **magnetic lock** (two opposed micro-magnets a one-directional field cannot release). Sophy — a magnetic rotor with **no** lock. Miethke — a rotor held by a **brake** that releases only when the adjustment tool presses on the valve (M.blue adds an "Active-Lock").

## 5. Siphon-control ("anti-siphon") devices {#siphon-control}

These respond to the **suction or flow surge** of upright posture rather than to posture itself.

- **Medtronic Delta chamber** — a normally closed chamber that opens to positive ventricular pressure but stays closed to negative distal pressure. Built into the Delta valve, Strata / Strata II and (as a siphon-control diaphragm) StrataMR II. Example: Strata II PL 1.5 is 70–90 mmH₂O lying but 85–105 mmH₂O at −50 cmH₂O hydrostatic.
- **Codman SiphonGuard** — *flow-activated*: a sudden surge closes the central ball-and-cone and diverts all CSF through a long spiral secondary path (resistance 1 cmH₂O per mL/h); when flow falls it reopens, and flow never fully stops. It **does not activate at low flow**, works in any orientation distal to the valve, and should be primed slowly (~0.5 mL/min). Integrated in some HAKIM, HAKIM Precision and CERTAS Plus models.
- **Strata NSC** ("no siphon control") is the same adjustable mechanism *without* the Delta chamber — its upper levels are much higher (PL 2.5 ≈ 200–220 vs 135–155 mmH₂O on Strata II).

## 6. Gravitational ("anti-gravity") units — built-in and add-on {#gravitational}

**Principle:** a heavy tantalum ball rests on a ball-and-cone seat. Lying flat, the ball rolls off the seat and adds no resistance; upright, its weight must be lifted, adding a fixed opening pressure. Intermediate angles add a graded amount. They must be implanted **parallel to the body axis**.

| Device | Built-in or add-on | Gravitational pressure | Adjustable? |
|---|---|---|---|
| **proGAV 2.0** (Miethke) | Built-in (SHUNTASSISTANT 2.0) on an adjustable 0–20 cmH₂O DP unit | 10 / 15 / 20 / 25 / 30 / 35 cmH₂O (or none) | DP yes; gravity fixed |
| **proGAV** (1st gen) | Built-in on an adjustable 0–20 cmH₂O DP unit | 10–35 cmH₂O (or none) | DP yes; gravity fixed |
| **M.blue** (Miethke) | **Built-in** — one valve: fixed DP unit 0 / 5 / 10 / 15 cmH₂O | 0–40 cmH₂O, continuously | **Gravity yes**; DP fixed |
| **M.blue plus** | Built-in: proGAV 2.0 DP unit + M.blue gravitational unit | 0–40 cmH₂O | Both |
| **GAV / GAV 2.0 / paediGAV** | Built-in fixed pairs | e.g., GAV 2.0 5/20 … 10/30 cmH₂O | No |
| **DualSwitch valve** | Built-in: separate lying (5–16) and upright (30–50 cmH₂O) chambers | Switch, not additive | No |
| **SHUNTASSISTANT 2.0** | **Add-on**, in series below any DP valve | 10–35 cmH₂O | No |
| **SHUNTASSISTANT / paediSA** | **Add-on** | 15–35 / 10 cmH₂O | No |
| **proSA** | **Add-on** | 0–40 cmH₂O (preset 20) | **Yes** |
| **SiphonX** (Sophysa) | **Add-on** downstream of a Polaris / Sophy (pre-attached on "-SX" models) | +200 mmH₂O fully upright | No |
| **Gravity Compensating Accessory** (Integra) | **Add-on**, anywhere on distal tubing | 2–4 steel balls; value not published | No |

**Is the M.blue an attachment?** No — the M.blue is a complete valve whose *gravitational* unit is the adjustable part. The true attachments are the SHUNTASSISTANT family, proSA, SiphonX and the Integra GCA, which you add in series to a separate differential-pressure valve.

**Total upright opening pressure** of a gravitational system = DP unit + gravitational unit. Example (Miethke): DP set to 10 cmH₂O with a 25 cmH₂O gravitational unit → **10 cmH₂O lying, 35 cmH₂O upright**.

## 7. MRI and programmable valves {#mri}

| Valve | MRI effect on the setting | After MRI |
|---|---|---|
{% for v in site.data.shunt_valves %}{% if v.kind == "programmable" %}| [{{ v.name }}]({{ '/shunts/valves/' | relative_url }}#{{ v.id }}) | {{ v.mri.label }} | {{ v.mri.after }} |
{% endif %}{% endfor %}

Fixed valves have nothing to reprogram, but every valve makes some artifact; the non-metallic Medtronic Delta and CSF-Flow Control valves make essentially none. Outside the scanner, strong everyday magnets can also move a setting — Integra warns that magnets over 80 gauss (household or loudspeaker magnets) near a HAKIM valve can change it, while Miethke's braked rotors and Sophysa's Polaris lock are designed to resist them.

## 8. Adjusting a setting safely — manufacturer rules {#adjusting}

- **Identify the valve first.** If a patient arrives from elsewhere, get a skull film and identify the model before anyone tries to adjust it ([X-ray guide]({{ '/shunts/xray-id/' | relative_url }})).
- **Codman HAKIM:** while becoming familiar, change by no more than **±40 mmH₂O per 24 h** and monitor for 24 h; X-ray to confirm. Keep ≤1 cm of tissue over the mechanism. An **inverted** valve (white marker on the left) is programmed by first setting 200, then **210 − the desired pressure** (190 and 200 cannot be reached).
- **Miethke proGAV 2.0 / proSA:** change by **≤8 cmH₂O per adjustment step** — the rotor takes the short way round, so 3 → 18 must go 3 → 11 → 18. Verify with the compass after every step; postoperative swelling can make the first days difficult. Vibration (e.g., jogging) can transiently lower the opening pressure by 25–35% (laboratory data).
- **Codman CERTAS Plus:** tissue over the valve <10 mm; the electronic tool kit must not enter the MR suite; a safety stop sits between settings 1 and 8.
- **Sophysa Polaris / Sophy:** the locator's pressure range must match the valve's (range dots on X-ray); clockwise raises, counter-clockwise lowers.
- **Medtronic Strata:** the StrataVarius gives a numeric readout (e.g., PL 2.0 = 115 mmH₂O); the Strata NSC LP valve can only be adjusted with StrataVarius.
- **Reservoirs:** frequent pumping can itself overdrain (Miethke).
- **Document** manufacturer, model, setting, siphon/gravitational components and distal site on every note.

## 9. Manufacturer starting-pressure recommendations (non-binding) {#recommendations}

These are the manufacturers' own suggestions — not clinical guidelines — and Miethke stresses they must be individualised (lower the gravitational unit for low mobility or high BMI; no gravitational unit for bedridden patients).

**M.blue** (DP unit 5 cmH₂O for all; upright total in brackets):

| Patient | Gravitational unit (cmH₂O) | Upright total |
|---|---|---|
| Newborns and children < 5 y | 20 | 25 |
| Children ≥ 5 y | 25 | 30 |
| Adults (< 1.60 m / > 1.80 m) | 25 (20 / 30) | 30 (25 / 35) |
| Adults > 65 y (< 1.60 m / > 1.80 m) | 20 (15 / 25) | 25 (20 / 30) |

**proGAV:** DP 5 cmH₂O standard for NPH; gravitational unit 20 cmH₂O (children ≤5 y, adults >60 y) or 25 (children >5 y, adults ≤60 y); −5 if shorter than 1.60 m, +5 if taller than 1.80 m.

**paediGAV:** <6 months 4/24; 6 months–5 years 9/24; >5 years 9/29 cmH₂O (lying/upright).

**Sizing an add-on gravitational unit (Miethke method):** choose the unit so that DP valve + gravitational unit ≈ (diaphragm-to-foramen-of-Monro distance) − 5 cm. Worked example from the IFU: 42 cm distance, DP valve 13 cmH₂O → 42 − 13 − 5 = 24 → select the 25 cmH₂O unit → standing IVP ≈ 25 + 13 − 42 = **−4 cmH₂O**. The DualSwitch valve uses the same distance-minus-5-cm rule for its upright chamber.

## 10. Recalls and safety notices {#recalls}

- **Medtronic Strata II & Strata NSC** — FDA Class 2 recall Z-1121-2017 (Jan–Jun 2017): reports of the set performance level disagreeing with the X-ray reading; the IFU warning was updated. [FDA record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfRes/res.cfm?id=152582)
- **Medtronic StrataMR (1st generation)** — FDA Class 1 recall Z-1702-2017 (Feb–Sep 2017): locator-tool misalignment could set the rotor wrong, giving higher opening pressure and underdrainage. [FDA record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfRes/res.cfm?id=153618)

## 11. Using the converter well {#converter}

1. Choose the source valve and setting (or type a pressure) and the posture you care about.
2. Read the result in all four units, plus the lying and upright opening pressures for that setting.
3. Look at the **closest equivalent** on the target valve *and* its neighbours above and below — then pick using clinical context, not just the smallest difference.
4. Remember the caveats: different reference flows, ±10–35 mmH₂O tolerances, catheter resistance, and fundamentally different siphon and gravity behaviour.

[Open the converter →]({{ '/shunts/converter/' | relative_url }})

## Related on Pterion Prep

- [Reference: CSF shunt systems, types and valves]({{ '/cases/cranial-csf/shunts/shunt-systems-reference.html' | relative_url }}) — shunt configurations, malfunction workup, complications
- [VP shunt]({{ '/cases/cranial-csf/vp-shunt.html' | relative_url }}) · [Shunt revision]({{ '/cases/cranial-csf/shunts/shunt-revision.html' | relative_url }}) · [Lumboperitoneal shunt]({{ '/cases/cranial-csf/shunts/lumboperitoneal-shunt.html' | relative_url }})

## Key literature

- Drake JM, et al. Randomized trial of cerebrospinal fluid shunt valve design in pediatric hydrocephalus. *Neurosurgery* 1998. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9696082/)
- Pollack IF, et al. (Hakim-Medos Investigator Group). A randomized, controlled study of a programmable shunt valve versus a conventional valve. *Neurosurgery* 1999. [PubMed](https://pubmed.ncbi.nlm.nih.gov/10598708/)
- Lemcke J, et al. Safety and efficacy of gravitational shunt valves in patients with idiopathic normal pressure hydrocephalus (SVASONA). *J Neurol Neurosurg Psychiatry* 2013. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23457222/)
- Huang AP, et al. Antisiphon device: a review of existing mechanisms and clinical applications to prevent overdrainage in shunted hydrocephalic patients. *Biomed J* 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/34411787/)
- Baird LC, et al. Pediatric hydrocephalus guidelines, Part 5: effect of valve type on cerebrospinal fluid shunt efficacy. *J Neurosurg Pediatr* 2014. [PubMed](https://pubmed.ncbi.nlm.nih.gov/25988781/)
- Valve identification on X-ray (open access, the source of this site's radiographs): Rhomberg T, et al. *Acta Neurochir* 2024 ([doi](https://doi.org/10.1007/s00701-024-05940-3)); Vach M, et al. *Clin Neuroradiol* 2025 ([doi](https://doi.org/10.1007/s00062-024-01490-4)); Giancardo L, et al. *Sci Rep* 2018 ([doi](https://doi.org/10.1038/s41598-018-34164-6)).

*Manufacturer sources (instructions for use, brochures, FDA 510(k) and recall records) are linked on every card in the [valve library]({{ '/shunts/valves/' | relative_url }}).*
