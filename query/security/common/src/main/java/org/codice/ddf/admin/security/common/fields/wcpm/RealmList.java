/**
 * Copyright (c) Codice Foundation
 * <p>
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 * <p>
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 **/
package org.codice.ddf.admin.security.common.fields.wcpm;

import org.codice.ddf.admin.common.fields.base.BaseListField;

public class RealmList extends BaseListField<Realm> {

    public static final String DEFAULT_FIELD_NAME = "realms";

    public static final String DESCRIPTION = "A list of Realms";

    public RealmList() {
        super(DEFAULT_FIELD_NAME, DESCRIPTION, new Realm().isRequired(true));
    }

    @Override
    public RealmList add(Realm value) {
        super.add(value);
        return this;
    }
}